from django.db import models
from apps.users.models import User

# ==============================================================================
# INGREDIENTE (La Materia Prima)
# ==============================================================================
class Ingredient(models.Model):
    CATEGORIES = [
        ('PROTEIN', 'Proteína'),
        ('CARB', 'Carbohidrato'),
        ('FAT', 'Grasa'),
        ('VEGETABLE', 'Vegetal'),
        ('FRUIT', 'Fruta'),
        ('DAIRY', 'Lácteo'),
        ('OTHER', 'Otro'),
    ]

    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    category = models.CharField(max_length=20, choices=CATEGORIES, default='OTHER')
    
    # Macros por cada 100g (Estándar internacional)
    calories = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Kcal (por 100g)")
    proteins = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Proteínas (g)")
    carbohydrates = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Carbohidratos (g)")
    fats = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Grasas (g)")
    
    # Opcional: Microminerales (podemos agregar más a futuro)
    fiber = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Fibra (g)")

    def __str__(self):
        return f"{self.name} ({self.calories} kcal/100g)"

# ==============================================================================
# RECETA / COMIDA (El Plato Final)
# ==============================================================================
class Meal(models.Model):
    # El creador (Nutricionista). Si es null, es una "Receta del Sistema" (pública)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_meals')
    
    name = models.CharField(max_length=150, verbose_name="Nombre del Plato")
    description = models.TextField(blank=True, verbose_name="Instrucciones / Descripción")
    image = models.ImageField(upload_to='meals/', null=True, blank=True)
    
    # Relación Muchos a Muchos: Una comida tiene muchos ingredientes
    # Usamos 'through' para especificar cantidades exactas
    ingredients = models.ManyToManyField(Ingredient, through='MealItem')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def total_calories(self):
        # Lógica calculada: Suma de las calorías de todos sus ingredientes
        total = sum(item.calories_contribution for item in self.meal_items.all())
        return round(total, 2)

# ==============================================================================
# ITEM DE COMIDA (La Cantidad Exacta: Ej. "150g de Pollo")
# ==============================================================================
class MealItem(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='meal_items')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    
    quantity_grams = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Cantidad (gramos)")

    class Meta:
        verbose_name = "Ingrediente de Receta"
        verbose_name_plural = "Ingredientes de Receta"

    @property
    def calories_contribution(self):
        # Regla de 3 simple: (CaloriasBase * Gramos) / 100
        return (self.ingredient.calories * self.quantity_grams) / 100
        
    def __str__(self):
        return f"{self.quantity_grams}g de {self.ingredient.name}"
    
# ==============================================================================
# PLAN NUTRICIONAL (El Calendario para el Paciente)
# ==============================================================================
class DietPlan(models.Model):
    # ¿A quién pertenece este plan? (Paciente)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diet_plans', limit_choices_to={'role': 'PACIENTE'})
    
    # ¿Quién lo creó? (Nutricionista)
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_plans', limit_choices_to={'role': 'NUTRICIONISTA'})
    
    name = models.CharField(max_length=150, verbose_name="Nombre del Plan (Ej: Hipertrofia Fase 1)")
    description = models.TextField(blank=True, verbose_name="Objetivo / Notas")
    
    # Vigencia
    is_active = models.BooleanField(default=True, verbose_name="¿Es el plan actual?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.patient.email}"

# ==============================================================================
# ASIGNACIÓN DE COMIDAS (El Horario)
# ==============================================================================
class PlanAllocation(models.Model):
    DAYS_OF_WEEK = [
        (1, 'Lunes'),
        (2, 'Martes'),
        (3, 'Miércoles'),
        (4, 'Jueves'),
        (5, 'Viernes'),
        (6, 'Sábado'),
        (7, 'Domingo'),
    ]
    
    MEAL_TIMES = [
        ('BREAKFAST', 'Desayuno'),
        ('MORNING_SNACK', 'Media Mañana'),
        ('LUNCH', 'Almuerzo'),
        ('AFTERNOON_SNACK', 'Media Tarde'),
        ('DINNER', 'Cena'),
    ]

    plan = models.ForeignKey(DietPlan, on_delete=models.CASCADE, related_name='allocations')
    
    # ¿Cuándo?
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK, verbose_name="Día")
    meal_time = models.CharField(max_length=20, choices=MEAL_TIMES, verbose_name="Momento del día")
    
    # ¿Qué come? (Vinculamos la Receta que creaste antes)
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, verbose_name="Plato / Receta")
    
    # Opcional: Notas específicas para este momento (Ej: "Tomar con mucha agua")
    notes = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Comida Asignada"
        verbose_name_plural = "Comidas Asignadas"
        # Ordenar por día y luego por orden lógico de comidas (se podría mejorar con un campo int, pero esto sirve)
        ordering = ['day_of_week', 'meal_time']

    def __str__(self):
        return f"{self.get_day_of_week_display()} - {self.get_meal_time_display()}: {self.meal.name}"