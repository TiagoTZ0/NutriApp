from django.contrib import admin
from django.urls import path, include
# Importamos las vistas de la documentación (Swagger)
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # 1. ADMIN DE DJANGO (El panel azul)
    path('admin/', admin.site.urls),
    
    # 2. NUESTRA API (Usuarios, Perfiles, JWT Login)
    path('api/', include('apps.users.urls')),
    
    # API DE NUTRICIÓN 
    path('api/nutrition/', include('apps.nutrition.urls')),

    # 3. LOGIN VISUAL DRF (Lo que tenías antes, útil para pruebas rápidas, uso de desarrollador)
    path('api-auth/', include('rest_framework.urls')),
    
    # 4. CLINICAL APP API
    path('api/clinical/', include('apps.clinical.urls')),

    # 5. DOCUMENTACIÓN AUTOMÁTICA (Fase 7.6 - Nuevo)
    # El archivo "plano" (Schema)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # La Interfaz Visual (Swagger UI) - IMPORTANTE
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Interfaz alternativa (Redoc)
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]