from django.contrib import admin
from .models import Ingredient, Meal, MealItem, DietPlan, PlanAllocation

# ==============================================================================
# 1. GESTIÓN DE INGREDIENTES
# ==============================================================================
@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'calories', 'proteins', 'carbohydrates', 'fats')
    list_filter = ('category',)
    search_fields = ('name',) # VITAL: Necesario para que el autocomplete funcione en Meal
    ordering = ('name',)

# ==============================================================================
# 2. GESTIÓN DE COMIDAS (RECETAS)
# ==============================================================================

# Tabla interna: Permite agregar ingredientes DENTRO de la pantalla de la Receta
class MealItemInline(admin.TabularInline):
    model = MealItem
    extra = 1  # Muestra 1 fila vacía lista para llenar
    autocomplete_fields = ['ingredient'] # Buscador rápido (no un dropdown gigante)
    min_num = 1 # Obliga a tener al menos 1 ingrediente

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'total_calories_display', 'created_at')
    search_fields = ('name',) # VITAL: Necesario para que el autocomplete funcione en DietPlan
    list_filter = ('created_by',)
    inlines = [MealItemInline] # <--- Conectamos la tabla de ingredientes

    # Truco para mostrar la propiedad calculada 'total_calories'
    def total_calories_display(self, obj):
        return f"{obj.total_calories} kcal"
    total_calories_display.short_description = "Calorías Totales"

# ==============================================================================
# 3. GESTIÓN DE PLANES (CALENDARIO)
# ==============================================================================

# Tabla interna: Permite asignar comidas DENTRO de la pantalla del Plan
class PlanAllocationInline(admin.TabularInline):
    model = PlanAllocation
    extra = 0
    autocomplete_fields = ['meal'] # Buscador rápido de recetas
    ordering = ('day_of_week', 'meal_time')

@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'patient', 'professional', 'is_active', 'created_at')
    list_filter = ('is_active', 'professional')
    search_fields = ('name', 'patient__email')
    
    # Aquí está la magia: Editamos el horario dentro del plan
    inlines = [PlanAllocationInline]
    
    # Autocomplete para buscar usuarios rápido
    # NOTA: Requiere que UserAdmin tenga 'search_fields' configurado (ya lo hicimos)
    autocomplete_fields = ['patient', 'professional']

# ==============================================================================
# 4. REGISTROS TÉCNICOS (Opcionales, por si necesitas depurar items sueltos)
# ==============================================================================
@admin.register(MealItem)
class MealItemAdmin(admin.ModelAdmin):
    list_display = ('meal', 'ingredient', 'quantity_grams', 'calories_contribution')
    search_fields = ('meal__name', 'ingredient__name')

@admin.register(PlanAllocation)
class PlanAllocationAdmin(admin.ModelAdmin):
    list_display = ('plan', 'day_of_week', 'meal_time', 'meal')
    list_filter = ('day_of_week', 'meal_time')