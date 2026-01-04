from rest_framework import serializers
from .models import Ingredient, Meal, MealItem, DietPlan, PlanAllocation

# --- 1. INGREDIENTE (Simple) ---
class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

# --- 2. RECETA (Compleja) ---
class MealItemSerializer(serializers.ModelSerializer):
    # Para que en el JSON salga el nombre del ingrediente y sus macros, no solo el ID
    ingredient_details = IngredientSerializer(source='ingredient', read_only=True)
    
    class Meta:
        model = MealItem
        fields = ['id', 'ingredient', 'ingredient_details', 'quantity_grams', 'calories_contribution']

class MealSerializer(serializers.ModelSerializer):
    # Incluimos los items dentro de la receta
    meal_items = MealItemSerializer(many=True, read_only=True)
    total_calories = serializers.ReadOnlyField() # Campo calculado

    class Meta:
        model = Meal
        fields = ['id', 'name', 'description', 'image', 'created_by', 'total_calories', 'meal_items', 'created_at']

# --- 3. PLAN (El Calendario) ---
class PlanAllocationSerializer(serializers.ModelSerializer):
    # Mostramos el detalle de la comida asignada
    meal_details = MealSerializer(source='meal', read_only=True)
    
    class Meta:
        model = PlanAllocation
        fields = ['id', 'day_of_week', 'meal_time', 'meal', 'meal_details', 'notes']

class DietPlanSerializer(serializers.ModelSerializer):
    allocations = PlanAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = DietPlan
        fields = ['id', 'name', 'description', 'patient', 'professional', 'is_active', 'allocations', 'created_at']