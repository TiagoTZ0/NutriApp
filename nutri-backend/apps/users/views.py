from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User

# Serializador actualizado
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestión de usuarios con seguridad Multi-Tenant.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        
        # 1. Super Admin ve todo
        if user.role == 'ADMIN':
            return User.objects.all().order_by('-created_at')

        # 2. Dueño de Clínica ve a todos en SU organización
        if user.role == 'ORG_OWNER' and user.organization:
            return User.objects.filter(organization=user.organization).order_by('-created_at')

        # 3. Nutricionista o Paciente solo ve su propio perfil
        # (Por seguridad, no queremos que un nutri vea los datos de usuario de otro nutri)
        return User.objects.filter(id=user.id)