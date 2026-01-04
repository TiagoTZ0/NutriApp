from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IngredientViewSet, MealViewSet, DietPlanViewSet

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)
router.register(r'meals', MealViewSet)
router.register(r'diet-plans', DietPlanViewSet, basename='dietplan')

urlpatterns = [
    path('', include(router.urls)),
]