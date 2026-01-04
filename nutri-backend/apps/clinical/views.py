from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import PermissionDenied
from .models import ClinicalPatient
from .serializers import ClinicalPatientListSerializer, ClinicalPatientDetailSerializer

class PatientViewSet(viewsets.ModelViewSet):
    """
    API para gestionar pacientes.
    - LIST: Devuelve resumen optimizado.
    - RETRIEVE/UPDATE: Devuelve detalle completo.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email']

    def get_serializer_class(self):
        # Optimizamos tráfico: Lista ligera vs Detalle pesado
        if self.action == 'list':
            return ClinicalPatientListSerializer
        return ClinicalPatientDetailSerializer

    def get_queryset(self):
        """
        🛡️ AISLAMIENTO MULTI-TENANT (Security Layer)
        Filtramos estrictamente por la organización del usuario logueado.
        """
        user = self.request.user
        
        # Validamos que el usuario tenga perfil profesional u org
        if user.role != 'PROFESSIONAL' and user.role != 'ORG_OWNER':
            raise PermissionDenied("Solo profesionales pueden gestionar expedientes.")

        if not user.organization:
            raise PermissionDenied("Tu cuenta no pertenece a ninguna organización clínica.")

        # Retornamos SOLO los pacientes de SU clínica
        return ClinicalPatient.objects.filter(organization=user.organization).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Al crear, asignamos automáticamente la organización del nutri.
        """
        serializer.save(organization=self.request.user.organization)