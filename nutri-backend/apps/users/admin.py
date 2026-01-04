from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ProfessionalProfile, PatientProfile, Organization

# ==============================================================================
# 1. ADMIN DE ORGANIZACIÓN
# ==============================================================================
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'plan_type', 'is_active', 'created_at')
    search_fields = ('name', 'slug')
    list_filter = ('plan_type', 'is_active')
    prepopulated_fields = {'slug': ('name',)} 

# ==============================================================================
# 2. INLINES (Para ver perfiles DENTRO del Usuario)
# ==============================================================================
class ProfessionalProfileInline(admin.StackedInline):
    model = ProfessionalProfile
    can_delete = False
    verbose_name_plural = 'Perfil de Nutricionista'
    fk_name = 'user'
    extra = 0 

class PatientProfileInline(admin.StackedInline):
    model = PatientProfile
    can_delete = False
    verbose_name_plural = 'Perfil de Paciente App'
    fk_name = 'user'
    extra = 0

# ==============================================================================
# 3. ADMIN DE USUARIO (EL PRINCIPAL 🌟)
# ==============================================================================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Lista principal: Email, Nombre Completo, Rol y Organización
    list_display = ('email', 'get_full_name', 'role', 'organization', 'is_active')
    ordering = ('email',)
    list_filter = ('role', 'organization', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')

    # Lógica Inteligente: Muestra solo el perfil que corresponde
    def get_inlines(self, request, obj=None):
        if not obj: 
            return []
        
        if obj.role in ['PROFESSIONAL', 'ORG_OWNER']:
            return [ProfessionalProfileInline]
        elif obj.role == 'PACIENTE':
            return [PatientProfileInline]
        return []

    # Formulario de Edición
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'organization', 'photo') 
        }),
        ('Rol y Permisos', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Fechas', {'fields': ('last_login', 'created_at')}),
    )
    
    # Formulario de Creación
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'organization', 'password', 'confirm_password'),
        }),
    )
    
    readonly_fields = ('created_at', 'last_login')

    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'Nombre Completo'


# ==============================================================================
# 4. ADMIN DE PERFILES (SIMPLIFICADO - REGRESO A LO BÁSICO)
# ==============================================================================
# Como ya ves todo desde "Usuarios", aquí dejamos lo mínimo indispensable.

@admin.register(ProfessionalProfile)
class ProfessionalProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'city')
    search_fields = ('user__email', 'license_number')

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'weight')
    search_fields = ('user__email',)