from rest_framework import serializers
from .models import ClinicalPatient

# ==============================================================================
# 1. SERIALIZADOR DE LISTA (Optimizado para Carga Rápida)
# ==============================================================================
class ClinicalPatientListSerializer(serializers.ModelSerializer):
    """
    Serializador ligero para la pantalla 'Mis Pacientes'.
    Calcula datos visuales en el backend para ahorrar trabajo al celular.
    """
    
    # Map app_user relationship to return only UUID
    app_user_id = serializers.PrimaryKeyRelatedField(
        source='app_user', 
        read_only=True, 
        allow_null=True
    )
    
    # Campos calculados (No existen en la BD, se crean al vuelo)
    status_label = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()

    class Meta:
        model = ClinicalPatient
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'email', 
            'is_active', 
            'app_user_id',  # 👈 El ID que busca tu Frontend (UUID o Null)
            'status_label', # "Vinculado" / "Pendiente"
            'initials',     # "JP"
            'photo'         # URL de la foto (si existe)
        ]
        read_only_fields = ['id', 'app_user_id']

    def get_status_label(self, obj):
        """Devuelve un texto legible para la UI sobre el estado de vinculación."""
        return "Vinculado" if obj.app_user else "Pendiente"

    def get_initials(self, obj):
        """Genera las iniciales (Ej: Juan Perez -> JP)"""
        fname = obj.first_name[0] if obj.first_name else ""
        lname = obj.last_name[0] if obj.last_name else ""
        return f"{fname}{lname}".upper()


# ==============================================================================
# 2. SERIALIZADOR DE DETALLE (Para ver el Expediente Completo)
# ==============================================================================
class ClinicalPatientDetailSerializer(serializers.ModelSerializer):
    """
    Serializador completo para cuando entras al detalle de un paciente.
    Incluye campos de auditoría y relaciones completas.
    """
    
    # Mantenemos el app_user_id para consistencia con la lista
    app_user_id = serializers.PrimaryKeyRelatedField(
        source='app_user', 
        read_only=True, 
        allow_null=True
    )

    class Meta:
        model = ClinicalPatient
        fields = '__all__' # Trae todo: phone, created_at, organization, etc.
        read_only_fields = ['id', 'app_user', 'organization', 'created_at', 'updated_at']