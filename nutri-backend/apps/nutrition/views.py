from rest_framework import viewsets, permissions
from .models import Ingredient, Meal, DietPlan
from .serializers import IngredientSerializer, MealSerializer, DietPlanSerializer

class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catálogo de Ingredientes (Solo lectura para usuarios, creación vía Admin)
    """
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticated]

class MealViewSet(viewsets.ModelViewSet):
    """
    Gestión de Recetas
    """
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Asignar automáticamente al usuario que crea la receta
        serializer.save(created_by=self.request.user)

class DietPlanViewSet(viewsets.ModelViewSet):
    """
    Gestión de Planes Nutricionales
    """
    serializer_class = DietPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # FILTRO DE SEGURIDAD (VITAL):
        user = self.request.user
        
        # 1. Si es Nutricionista: Ve los planes que ÉL creó
        if user.role == 'NUTRICIONISTA':
            return DietPlan.objects.filter(professional=user)
            
        # 2. Si es Paciente: Ve los planes asignados a ÉL
        elif user.role == 'PACIENTE':
            return DietPlan.objects.filter(patient=user)
            
        # 3. Si es Admin: Ve todo
        return DietPlan.objects.all()