import uuid
from django.db import models
from django.conf import settings  # Para referenciar a tu usuario maestro

class ClinicalPatient(models.Model):
    """
    Representa el Expediente Clínico de un paciente.
    Es propiedad de una Organización (Clínica/Nutri) y puede o no
    estar vinculado a un Usuario de App real.
    """
    # ID Blindado (UUID)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Multi-tenant security: each patient belongs to an organization
    organization = models.ForeignKey(
        'users.Organization', 
        on_delete=models.CASCADE, 
        related_name='patients',
        verbose_name="Clínica"
    )

    # DATOS DEL EXPEDIENTE
    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    email = models.EmailField(null=True, blank=True, verbose_name="Email del Paciente") 
    phone = models.CharField(max_length=20, null=True, blank=True, verbose_name="Teléfono")
    
    # Patient profile photo
    photo = models.ImageField(upload_to='patients/photos/', null=True, blank=True, verbose_name="Foto")

    # ESTADO DEL TRATAMIENTO
    is_active = models.BooleanField(default=True, verbose_name="¿Activo?")
    
    # Link to app user for unified account
    app_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,
        null=True, 
        blank=True, 
        related_name='clinical_records',
        verbose_name="Usuario de App Vinculado"
    )

    # Auditoría
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Expediente de Paciente"
        verbose_name_plural = "Expedientes de Pacientes"
        ordering = ['-created_at'] # Muestra los recientes primero

    def __str__(self):
        org_name = self.organization.name if self.organization else "Sin Clínica"
        return f"{self.first_name} {self.last_name} ({org_name})"

    def save(self, *args, **kwargs):
        """Auto-linking with app user if email matches"""
        # Normalize email
        if self.email:
            self.email = self.email.lower().strip()

        # Attempt to link with existing user
        if self.email and not self.app_user:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                # Search for user with matching email and PATIENT role
                existing_user = User.objects.get(email=self.email, role='PACIENTE')
                
                self.app_user = existing_user
                print(f"Auto-linked patient {self.email} with app user")
                
            except User.DoesNotExist:
                pass # No pasa nada, queda pendiente
            except Exception as e:
                print(f"Warning during auto-linking: {e}")

        super().save(*args, **kwargs)