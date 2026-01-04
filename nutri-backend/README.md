# NutriApp - Backend

Backend de NutriApp: una API REST robusta para gestión nutricional clínica, construida con **Django** y **Django REST Framework**. El código está organizado en aplicaciones temáticas dentro de `apps/` (`users`, `clinical`, `nutrition`) siguiendo el patrón MTV de Django.

---

## ⚙️ Tecnología y Arquitectura

**Stack:**
- **Python 3.11+**
- **Django 5.x** — Web framework
- **Django REST Framework** — Construcción de APIs
- **drf-spectacular** — Documentación OpenAPI automática (Swagger UI)
- **djangorestframework-simplejwt** — Autenticación JWT
- **PostgreSQL** — Base de datos (recomendado)
- **Docker** — Contenerización para producción

**Arquitectura:**
- **Modular:** cada aplicación (`users`, `nutrition`, `clinical`) es independiente con su propio modelo, serializer, viewset y urls.
- **Multi-tenant:** soporta múltiples organizaciones (clínicas) con aislamiento seguro de datos.
- **API REST completa** con CRUD, búsqueda, filtrado y permisos granulares.

---

## 📁 Estructura del Proyecto

```
nutri-backend/
├── apps/
│   ├── users/              # Gestión de usuarios, organización, autenticación
│   │   ├── models.py       # User, Organization, ProfessionalProfile, PatientProfile
│   │   ├── serializers.py  # UserSerializer, OrganizationSerializer
│   │   ├── views.py        # UserViewSet (CRUD + multi-tenant)
│   │   └── urls.py         # Router + endpoints JWT
│   │
│   ├── clinical/           # Gestión de pacientes y expedientes
│   │   ├── models.py       # ClinicalPatient
│   │   ├── serializers.py  # ClinicalPatientListSerializer, DetailSerializer
│   │   ├── views.py        # PatientViewSet (búsqueda, auto-matching)
│   │   └── urls.py         # Endpoints CRUD
│   │
│   └── nutrition/          # Ingredientes, recetas y planes nutricionales
│       ├── models.py       # Ingredient, Meal, MealItem, DietPlan, PlanAllocation
│       ├── serializers.py  # IngredientSerializer, MealSerializer, DietPlanSerializer
│       ├── views.py        # ViewSets para ingredientes, comidas y planes
│       └── urls.py         # Endpoints CRUD
│
├── config/                 # Configuración del proyecto Django
│   ├── settings/
│   │   ├── base.py         # Settings compartidos (DB, apps, middleware)
│   │   └── local.py        # Overrides para desarrollo local
│   ├── urls.py             # Router principal (incluye /api/docs/)
│   ├── asgi.py             # Entrada para producción (async)
│   └── wsgi.py             # Entrada para servidores tradicionales
│
├── requirements/
│   └── base.txt            # Dependencias Python
│
├── scripts/
│   └── entrypoint.sh       # Script para Docker
│
├── manage.py               # CLI de Django
├── dockerfile              # Imagen Docker
├── .env.example            # Variables de entorno de ejemplo
└── README.md               # Este archivo
```

---

## � Subscription Plans

The application supports 4 main subscription tiers with different limits and features:

| Plan | Max Patients | Custom Branding | Marketplace | Shopping List | Support Level |
|------|-------------|-----------------|-------------|---------------|---------------|
| **STARTER** | 10 | ❌ | ❌ | ❌ | Community Support |
| **PROFESSIONAL** | 30 | ❌ | ✅ | ✅ | Community Support |
| **BUSINESS** | 100 | ✅ | ✅ | ✅ | Email Support |
| **ENTERPRISE** | Unlimited | ✅ | ✅ | ✅ | Priority Support |

Plans are defined in `apps/users/models.py` under the `Organization` model. The `plan_type` field stores the current plan, and several properties (`max_patients`, `allows_branding`, etc.) enforce the limits and features.

---

## �🚀 Cómo Ejecutar Localmente

### Opción 1: Sin Docker (Desarrollo Rápido)

**1. Crear entorno virtual**
```bash
python -m venv .venv
# En Windows:
.\.venv\Scripts\activate
# En macOS/Linux:
source .venv/bin/activate
```

**2. Instalar dependencias**
```bash
pip install -r requirements/base.txt
```

**3. Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env
# Editar .env y establecer:
# - SECRET_KEY: una clave segura
# - DEBUG: True (para desarrollo)
# - SQL_ENGINE, SQL_DATABASE, SQL_USER, SQL_PASSWORD: credenciales de PostgreSQL
# - (Opcional) ALLOWED_HOSTS: "localhost,127.0.0.1"
```

**4. Ejecutar migraciones**
```bash
python manage.py migrate
```

**5. Crear superuser (admin)**
```bash
python manage.py createsuperuser
# Email: admin@example.com
# Password: tu_contraseña
```

**6. Cargar datos de prueba (opcional)**
```bash
python manage.py loaddata # Si tenemos fixtures en el repo
```

**7. Iniciar servidor**
```bash
python manage.py runserver
```
El servidor estará en `http://localhost:8000/`

---

### Opción 2: Con Docker (Recomendado para Producción)

**1. Construir imagen**
```bash
docker build -t nutri-backend:latest .
```

**2. Crear archivo `.env`** (copiar de `.env.example`)

**3. Ejecutar contenedor**
```bash
docker run -it --env-file .env -p 8000:8000 nutri-backend:latest
```

**4. O usar docker-compose** (desde la raíz del proyecto)
```bash
docker-compose up --build
```

---

## 📡 Endpoints Principales

**Base URL:** `http://localhost:8000/api/`

### 🔐 Autenticación (JWT)

```
POST /api/login/
  Obtener tokens de acceso
  Request:  { "email": "user@example.com", "password": "password123" }
  Response: { "access": "eyJ...", "refresh": "eyJ..." }

POST /api/refresh/
  Refrescar access token expirado
  Request:  { "refresh": "eyJ..." }
  Response: { "access": "eyJ..." }
```

### 👥 Usuarios (`/api/users/`)

```
GET    /api/users/
       Lista de usuarios (filtrado por rol y organización)
       Headers: Authorization: Bearer <access_token>
       Response: [{ "id": "uuid", "email": "...", "role": "PROFESSIONAL", ... }]

POST   /api/users/
       Crear usuario
       Request:  { "email": "...", "first_name": "...", "role": "PROFESSIONAL" }
       Response: { "id": "uuid", ... }

GET    /api/users/{id}/
       Detalle de usuario específico

PUT/PATCH /api/users/{id}/
       Actualizar usuario

DELETE /api/users/{id}/
       Eliminar usuario
```

**Reglas de visibilidad (multi-tenant):**
- `ADMIN`: ve todos los usuarios
- `ORG_OWNER`: ve usuarios de su organización
- `PROFESSIONAL` / `PACIENTE`: solo ve su propio perfil

---

### 🥗 Nutrición (`/api/nutrition/`)

```
GET    /api/nutrition/ingredients/
       Catálogo de ingredientes (solo lectura)
       Response: [{ "id": "uuid", "name": "Pollo", "calories": 165, ... }]

CRUD   /api/nutrition/meals/
       Gestión de recetas
       POST:   crea receta con meal_items
       GET:    lista con detalle de ingredientes

CRUD   /api/nutrition/diet-plans/
       Planes nutricionales asignados a pacientes
       Queryset filtrado por rol:
         - PROFESSIONAL: ve planes que creó
         - PACIENTE: ve planes que le asignaron
         - ADMIN: ve todos
```

---

### 🏥 Gestión Clínica (`/api/clinical/`)

```
GET    /api/clinical/patients/
       Lista de expedientes clínicos
       Búsqueda: ?search=juan
       Response: [{ "id": "uuid", "first_name": "Juan", "app_user_id": "uuid|null", ... }]

POST   /api/clinical/patients/
       Crear expediente (auto-vinculación con usuario de app si existe)
       Request:  { "first_name": "Juan", "last_name": "Pérez", "email": "juan@example.com" }

GET    /api/clinical/patients/{id}/
       Detalle completo del expediente

PUT/PATCH /api/clinical/patients/{id}/
       Actualizar expediente

DELETE /api/clinical/patients/{id}/
       Eliminar expediente
```

**Permisos:**
- Solo `PROFESSIONAL` y `ORG_OWNER` pueden acceder
- Multi-tenant: datos filtrados por organización del usuario

---

### 📖 Documentación Automática

```
GET    /api/schema/
       Schema en JSON/YAML (OpenAPI 3.0)

GET    /api/docs/
       Swagger UI interactiva (interfaz bonita para probar endpoints)

GET    /api/redoc/
       ReDoc UI alternativa
```

> **Tip:** Ve a `http://localhost:8000/api/docs/` para una experiencia interactiva donde puedes probar los endpoints con un simple clic.

---

## 🔑 Conceptos Clave

### Multi-Tenant Security
Cada usuario pertenece a una `Organization` (clínica). Los ViewSets filtra automáticamente los datos:

```python
# En clinical/views.py
def get_queryset(self):
    user = self.request.user
    # Solo ver pacientes de tu clínica
    return ClinicalPatient.objects.filter(organization=user.organization)
```

### Auto-Matching de Pacientes
Cuando un profesional crea un expediente clínico con email, el backend busca automáticamente un usuario app con ese email y lo vincula:

```python
# En clinical/models.py
if self.email and not self.app_user:
    try:
        existing_user = User.objects.get(email=self.email, role='PACIENTE')
        self.app_user = existing_user  # Vinculación automática ✨
    except User.DoesNotExist:
        pass
```

### Roles y Permisos
- `ADMIN` — Acceso total, ve toda la plataforma
- `ORG_OWNER` — Dueño de clínica, maneja usuarios y pacientes de su org
- `PROFESSIONAL` — Nutricionista, crea planes para sus pacientes
- `PACIENTE` — Usuario final, ve sus planes y come en la app

### Serializers Optimizados
Usamos diferentes serializers para list vs detail (reduce tráfico):

```python
# En clinical/views.py
def get_serializer_class(self):
    if self.action == 'list':
        return ClinicalPatientListSerializer  # Ligero
    return ClinicalPatientDetailSerializer   # Pesado con todos los campos
```

---

## 🔧 Variables de Entorno

Copia `.env.example` a `.env` y completa los valores:

```env
# Django
SECRET_KEY=your-secret-key-change-this-in-production
DEBUG=True  # False en producción
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=nutriapp_db
SQL_USER=postgres
SQL_PASSWORD=postgres
SQL_HOST=db
SQL_PORT=5432

# JWT (opcional, defaults están en settings)
JWT_ALGORITHM=HS256

# CORS (si necesitas acceder desde otro dominio)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## 📚 Stack de Dependencias

Ver `requirements/base.txt` para lista completa. Principales:

- `djangorestframework` — API REST
- `drf-spectacular` — Documentación OpenAPI
- `djangorestframework-simplejwt` — JWT
- `psycopg2-binary` — Driver PostgreSQL
- `python-decouple` — Manejo de variables de entorno
- `pillow` — Procesamiento de imágenes (foto de perfil)

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
python manage.py test

# Con verbosidad
python manage.py test --verbosity=2

# Test específico
python manage.py test apps.users.tests
```

---

## 📋 Checklist de Deploymen

- [ ] SECRET_KEY es segura en `.env`
- [ ] DEBUG = False
- [ ] ALLOWED_HOSTS configurado
- [ ] Database = PostgreSQL en producción
- [ ] SSL/HTTPS habilitado
- [ ] CORS configurado para dominios autorizados
- [ ] Backups automáticos de DB
- [ ] Logs centralizados (ej: Sentry)
- [ ] Rate limiting en endpoints públicos

---

## 🎯 Siguientes Pasos

1. **Frontend:** conecta la app móvil usando el cliente HTTP en `nutri-mobile/src/core/api/`
2. **Tests:** escribe test cases para endpoints críticos (auth, creación de pacientes)
3. **Monitoreo:** configura alertas para errores 5xx
4. **Cache:** considera agregar Redis para caching de ingredientes
5. **Documentación:** genera PDF de la API con endpoints y ejemplos

---

## 💬 Preguntas Frecuentes

**P: ¿Cómo cambio la contraseña de un usuario?**  
R: Usa el endpoint `PATCH /api/users/{id}/` con el campo `password` (será hasheado automáticamente).

**P: ¿Cómo vinculo un expediente con un usuario de app?**  
R: Escribe el email en el campo `email` del expediente. El backend lo busca y vincula automáticamente.

**P: ¿Puedo usar SQLite en producción?**  
R: No recomendado. Usa PostgreSQL para manejo concurrente y seguridad.

---

*Documento actualizado: Enero 2026 — Backend listo para desarrollo y producción.*

## Testing

Se pueden añadir pruebas unitarias con `pytest` o la suite de testing de Django. (Si quieres, puedo añadir un `pytest` básico y CI config).

## Para la presentación en tu portafolio

- Incluye: stack, arquitectura (apps por dominio), capturas de pantalla de la documentación OpenAPI `/api/schema/` y ejemplos de endpoints.
- Indica que las variables secretas están en `.env` y que nunca se deben subir al repositorio.
