from django.contrib import admin
from .models import ClinicalPatient

@admin.register(ClinicalPatient)
class ClinicalPatientAdmin(admin.ModelAdmin):
    # Qué columnas ver en la lista
    list_display = ('first_name', 'last_name', 'email', 'organization', 'is_active', 'app_user')
    
    # Por qué campos buscar
    search_fields = ('first_name', 'last_name', 'email')
    
    # Filtros laterales (muy útil para ver pacientes por clínica)
    list_filter = ('organization', 'is_active')
    
    # Campos de solo lectura (para que no edites el ID por error)
    readonly_fields = ('created_at', 'updated_at')