import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

# ==============================================================================
# 1. ORGANIZACIÓN (La Entidad que Paga)
# ==============================================================================
class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name="Nombre del Consultorio/Clínica")
    slug = models.SlugField(unique=True, help_text="Identificador único para URL")
    logo_url = models.URLField(max_length=500, null=True, blank=True, verbose_name="Logo URL")
    
    # Subscription plan
    PLAN_CHOICES = [
        ('STARTER', 'Plan Starter'),
        ('PROFESSIONAL', 'Plan Professional'),
        ('BUSINESS', 'Plan Business'),
        ('ENTERPRISE', 'Plan Enterprise'),
    ]
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES, default='STARTER')
    
    # Control de Vigencia
    is_active = models.BooleanField(default=True)
    subscription_start = models.DateTimeField(auto_now_add=True, verbose_name="Inicio Suscripción")
    subscription_end = models.DateTimeField(null=True, blank=True, verbose_name="Fin Suscripción")
    
    # Datos Fiscales
    tax_id = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_plan_type_display()})"

    @property
    def has_active_subscription(self):
        if not self.subscription_end:
            return True 
        return timezone.now() < self.subscription_end

    # Plan limits and features
    @property
    def max_patients(self):
        """Maximum number of active patients allowed per plan"""
        if self.plan_type == 'STARTER': return 10
        if self.plan_type == 'PROFESSIONAL': return 30
        if self.plan_type == 'BUSINESS': return 100
        # ENTERPRISE is unlimited
        return 999999 

    @property
    def allows_branding(self):
        """Whether plan allows custom branding"""
        return self.plan_type in ['BUSINESS', 'ENTERPRISE']

    @property
    def allows_marketplace(self):
        """Whether organization appears in public directory"""
        return self.plan_type in ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']
    
    @property
    def allows_shopping_list(self):
        """Whether plan allows interactive shopping list"""
        return self.plan_type in ['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']
    
    @property
    def support_level(self):
        """Support level for the plan"""
        if self.plan_type == 'ENTERPRISE': return 'Priority Support'
        if self.plan_type == 'BUSINESS': return 'Email Support'
        return 'Community Support'


# ==============================================================================
# 2. GESTOR DE USUARIOS
# ==============================================================================
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        return self.create_user(email, password, **extra_fields)


# ==============================================================================
# 3. EL MODELO DE USUARIO
# ==============================================================================
class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Super Admin'
    ORG_OWNER = 'ORG_OWNER', 'Dueño de Clínica'
    PROFESSIONAL = 'PROFESSIONAL', 'Nutricionista'
    PACIENTE = 'PACIENTE', 'Paciente'

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150, blank=True, verbose_name="Nombre")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Apellido")
    photo = models.ImageField(upload_to='users/photos/', null=True, blank=True, verbose_name="Foto de Perfil")
    
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='users',
        help_text="Clínica a la que pertenece este usuario"
    )
    
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PROFESSIONAL)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    cognito_sub = models.CharField(max_length=255, null=True, blank=True, unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.email} ({self.role})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def save(self, *args, **kwargs):
        if self.role == UserRole.ADMIN or self.is_superuser:
            self.organization = None
        super().save(*args, **kwargs)


# ==============================================================================
# 4. PERFIL PROFESIONAL
# ==============================================================================
class ProfessionalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='professional_profile')
    license_number = models.CharField(max_length=50, blank=True)
    bio = models.TextField(blank=True)
    specialties = models.JSONField(default=list, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil Pro: {self.user.email}"


# ==============================================================================
# 5. PERFIL PACIENTE
# ==============================================================================
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=[('M', 'M'), ('F', 'F'), ('O', 'Otro')], blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    allergies = models.TextField(blank=True)
    medical_conditions = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil App: {self.user.email}"