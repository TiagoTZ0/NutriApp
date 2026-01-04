# NutriApp - Mobile

Aplicación móvil nativa multiplataforma (iOS, Android, Web) para la plataforma NutriApp. Permite a nutricionistas profesionales gestionar sus pacientes y a pacientes ver y seguir sus planes nutricionales personalizados(faltan funcionalidades).

**Construida con:**
- **Expo** — Framework que abstrae React Native y simplifica la distribución
- **React Native** — Código compartido iOS / Android / Web
- **TypeScript** — Tipado estático para evitar bugs
- **Zustand** — State management ligero y performante
- **Axios** — Cliente HTTP tipado
- **React Navigation** — Navegación robusta (Stack / Tabs)

---

## 🎯 Características Principales

### ✅ Implementado
- **Autenticación completa:** registro, login, refresh tokens, logout
- **Multi-rol:** interfaz diferente para Profesionales vs Pacientes
- **Profesionales:** ver lista de pacientes, agregar nuevos pacientes, ver detalles
- **Pacientes:** (UI por hacer)
- **Almacenamiento seguro:** tokens en SecureStore (iOS/Android) o AsyncStorage (Web)
- **Documentación automática** desde el backend (OpenAPI/Swagger)

### 🚧 ToDo
- Pantalla de detalle de ingredientes (list → detail)
- Planes nutricionales (vista y edición por profesionales)
- Chat/notificaciones entre profesional y paciente
- Gráficos de progreso nutricional
- Exportar planes en PDF

---

## 📁 Estructura del Proyecto

```
nutri-mobile/
├── src/
│   ├── core/                   # Funcionalidades transversales
│   │   ├── api/
│   │   │   └── api-client.ts   # Cliente HTTP (Axios con interceptores)
│   │   ├── config/
│   │   │   ├── api.ts          # Configuración de endpoints
│   │   │   └── constants.ts    # Constantes globales
│   │   └── storage/
│   │       └── storage.ts      # Abstracción secure storage (tokens)
│   │
│   ├── domain/                 # Contratos y modelos
│   │   ├── dto/                # Data Transfer Objects (DTO)
│   │   │   ├── IAuthResponse.ts # Respuesta del login
│   │   │   └── INutrientData.ts # Datos nutricionales
│   │   ├── models/             # Interfaces de negocio
│   │   │   ├── IUser.ts
│   │   │   ├── IPatient.ts
│   │   │   ├── IFood.ts
│   │   │   ├── IMeal.ts
│   │   │   ├── IDietPlan.ts
│   │   │   └── IDietItem.ts
│   │   └── rules/              # Lógica de negocio / validaciones
│   │
│   ├── features/               # Módulos de negocio (por feature)
│   │   ├── auth/               # Autenticación y onboarding
│   │   │   ├── types.ts        # Types específicos del feature
│   │   │   ├── components/     # Componentes reutilizables
│   │   │   ├── screens/        # Pantallas (LandingScreen, LoginScreen, etc.)
│   │   │   └── store/          # Zustand store (auth-store.ts)
│   │   │
│   │   ├── nutrition/          # Nutrición y planes
│   │   │   ├── types.ts
│   │   │   └── store/          # nutrition-store.ts
│   │   │
│   │   ├── professional/       # Módulo profesionales
│   │   │   ├── components/     # PatientCard, etc.
│   │   │   ├── screens/        # ProfessionalHomeScreen, PatientListScreen, AddPatientScreen
│   │   │   └── store/          # patient-store.tsx
│   │   │
│   │   ├── patient/            # Módulo pacientes (UI)
│   │   │
│   │   └── clinical/           # (Futuro) Gestión clínica
│   │
│   ├── navigation/             # Configuración de rutas
│   │   ├── AppNavigator.tsx    # Stack principal (auth/logged)
│   │   ├── ProfessionalNavigator.tsx # Tab navigator para profesionales
│   │   └── types.ts            # Type para navegación
│   │
│   └── shared/                 # Componentes y hooks compartidos
│       ├── components/
│       │   ├── buttons/        # BackButton, ActionButton, etc.
│       │   └── animations/     # AnimatedPressableButton, AnimatedPressableScale
│       └── hooks/              # Hooks personalizados
│
├── App.tsx                     # Entry point de la app
├── index.ts                    # Entry point web
├── app.json                    # Configuración Expo
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
├── .env.example                # Variables de entorno
└── README.md                   # Este archivo
```

---

## 🏗️ Arquitectura

### Capas Principales

1. **Core** — Funcionalidades compartidas (API, storage, config)
2. **Domain** — Contratos de tipos (interfaces TypeScript, DTOs, models)
3. **Features** — Módulos de negocio independientes (auth, professional, nutrition, etc.)
4. **Navigation** — Configuración de rutas y stacks
5. **Shared** — Componentes y hooks reutilizables

Esta estructura se alinea con **Clean Architecture** y **Domain-Driven Design**, permitiendo:
- ✅ Fácil testing (cada feature es independiente)
- ✅ Escalabilidad (nuevas features sin afectar las existentes)
- ✅ Mantenibilidad (cambios centralizados)
- ✅ Reutilización (componentes en shared)

### State Management (Zustand)

Cada feature tiene su propio store:

```typescript
// features/auth/store/auth-store.ts
create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isLoading: false,
  login: async (email, password) => { ... },
  logout: () => set({ user: null, tokens: null }),
}))
```

Zustand es mucho más ligero que Redux y perfectamente tipado en TypeScript.

---

## 🚀 Cómo Ejecutar Localmente

### Requisitos Previos
- Node.js 18+ (incluye npm)
- Expo CLI: `npm install -g expo-cli`
- Un emulador Android, simulador iOS, o usar la app Expo Go en tu teléfono real
- El backend (NutriApp) corriendo en `localhost:8000` (o configura tu IP)

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Configurar Conexión API
Edita `src/core/config/constants.ts` y establece la IP/URL del backend:

```typescript
// Para desarrollo local
const LOCAL_IP = 'http://192.168.1.20:8000/api';  // Cambia 192.168.1.20 a tu IP local
// O si usas ngrok para tunnel
// const LOCAL_IP = 'https://abc123.ngrok.io/api';
```

> **Tip:** En Windows, abre PowerShell y ejecuta `ipconfig` para encontrar tu IP local (busca IPv4 Address).

### Paso 3: Iniciar Expo
```bash
npx expo start
```

Aparecerá un menú:
```
i Tap an emulator or device key to open Expo Go
a Start Android emulator
w Start web
```

Escoge una opción:
- **i** (emulator/device) — Si tienes un emulador o teléfono con Expo Go
- **a** — Abre Android Emulator automáticamente
- **w** — Abre en navegador web (útil para probar rápido)

### Paso 4: Probar la App

1. Abre la pantalla de login
2. Intenta registrarte con email/password
3. Inicia sesión
4. Deberías ver la navegación según tu rol (Profesional → home con tabs, Paciente → home simplificada)

---

## 🔌 Configuración del Cliente API

### `src/core/api/api-client.ts`

El cliente HTTP tiene interceptores automáticos:

```typescript
// ✅ Interceptor de request: agrega el token en headers
apiClient.interceptors.request.use((config) => {
  const token = storage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor de response: refuerza el token si expira
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado → pedir refresh
      const newToken = await authStore.refreshToken();
      // Reintentar request original
    }
    return Promise.reject(error);
  }
);
```

### `src/core/config/constants.ts`

```typescript
export const API_BASE_URL = 'http://192.168.1.20:8000/api';
// Endpoints relativos
export const ENDPOINTS = {
  LOGIN: '/login/',
  REFRESH: '/refresh/',
  USERS: '/users/',
  PATIENTS: '/clinical/patients/',
  INGREDIENTS: '/nutrition/ingredients/',
  MEALS: '/nutrition/meals/',
  DIET_PLANS: '/nutrition/diet-plans/',
};
```

---

## 📱 Pantallas Principales

### Flujo de Autenticación
1. **LandingScreen** — Bienvenida con opciones "Registrarse" / "Iniciar sesión"
2. **RegisterScreen** — Formulario de registro (email, password, nombre, rol)
3. **LoginScreen** — Formulario de login
4. **OnboardingScreen** — Primeros pasos (seleccionar rol, términos, etc.)

### Flujo Profesional (Nutricionista)
- **ProfessionalHomeScreen** — Dashboard con tabs (Pacientes, Calendario, Mensajes, Perfil)
- **PatientListScreen** — Lista de pacientes con búsqueda y botón "Agregar"
- **AddPatientScreen** — Formulario para crear expediente (auto-vinculación con usuario app)
- **ProfileScreen** — Ver y editar perfil profesional

### Flujo Paciente
- **HomeScreen** — Dashboard con planes activos
- **DietPlanDetailScreen** — Ver plan actual con comidas por día (UI en progreso)
- **FoodSearchScreen** — Buscar ingredientes en catálogo (UI pendiente)

---

## 🧩 Interfaces TypeScript (Contratos)

Todos los tipos están tipados con TypeScript. Ver [domain/models/](src/domain/models/) y [domain/dto/](src/domain/dto/):

### Autenticación
```typescript
interface IAuthResponse {
  refresh: string;
  access: string;
}
```

### Usuario
```typescript
interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'PROFESSIONAL' | 'PACIENTE' | 'ADMIN' | 'ORG_OWNER';
  organization?: string;
  photo?: string;
}
```

### Paciente
```typescript
interface IPatient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  app_user_id?: string | null;
  photo?: string;
}
```

### Plan Nutricional
```typescript
interface IDietPlan {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  kcal_target?: number;
  meals: IMeal[];
}

interface IMeal {
  id: string;
  name: string;
  items: IDietItem[];
  total_calories?: number;
}

interface IDietItem {
  id: string;
  quantity_grams: number;
  food: IFood;
}

interface IFood {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
```

Ver [src/domain/models/](src/domain/models/) para la lista completa y actualizada.

---

## 🔐 Seguridad

### Almacenamiento de Tokens
Los tokens JWT se guardan de forma segura:
- **iOS/Android:** `expo-secure-store` (encriptado en keychain/keystore)
- **Web:** `AsyncStorage` (localStorage)

```typescript
// storage.ts
export const storage = {
  setItem: async (key, value) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
};
```

### Interceptores de Errores
Si un endpoint devuelve 401 (no autenticado), la app automáticamente:
1. Intenta refrescar el token con `refresh_token`
2. Si falla, limpia storage y lleva al user a login
3. Reintentar el request original

---

## 🧪 Testing

Próximamente:
```bash
npm test                    # Ejecutar tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

Se recomienda escribir tests para:
- Componentes principales (LoginForm, PatientCard)
- Lógica de stores (auth-store, patient-store)
- Funciones de validación

---

## 📦 Dependencias Principales

```json
{
  "expo": "~50.0.0",
  "react": "~18.2.0",
  "react-native": "0.73.0",
  "typescript": "~5.3.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "expo-secure-store": "~12.3.0",
  "@react-native-async-storage/async-storage": "^1.21.0"
}
```

Ver `package.json` para la lista completa.

---

## 🚀 Deployment

### Build para Producción

**Android (APK):**
```bash
eas build --platform android
# Luego descargar APK e instalar en dispositivo o Play Store
```

**iOS (IPA):**
```bash
eas build --platform ios
# Luego descargar IPA e instalar en TestFlight o App Store
```

**Web:**
```bash
expo export --platform web
# Archivos en ./dist/
```

Necesitarás registrar la app en Expo:
```bash
npx eas-cli@latest login  # Con tu cuenta de Expo
```

---

## 🎯 Roadmap Próximas Fases

- [ ] Pantallas de nutrición completadas (detalle de plan, edición)
- [ ] Chat en tiempo real profesional ↔ paciente
- [ ] Push notifications (recordatorios de comidas)
- [ ] Gráficos de seguimiento (Recharts o Victory)
- [ ] Exportar planes en PDF
- [ ] Integración con Apple Health / Google Fit
- [ ] Modo offline (sync cuando hay conexión)
- [ ] Soporte para fotografía de comidas (reconocimiento con IA)

---

## 🐛 Troubleshooting

**P: La app no se conecta al backend**
R: Revisa que:
1. El backend está corriendo (`python manage.py runserver`)
2. Actualizaste `LOCAL_IP` en `constants.ts` a tu IP real
3. Estás en la misma red WiFi (emulador y PC)
4. Firewall no bloquea puerto 8000

**P: Metro bundler tarda mucho**
R: Ejecuta:
```bash
npx expo start -c  # Clear cache
```

**P: Token expirado al hacer requests**
R: Zustand debería refrescarlo automáticamente. Si no, limpia storage:
```bash
npx expo start --clear  # Borra caché y storage
```

**P: ¿Cómo debuggeo?**
R: Usa React DevTools:
```bash
npm install --save-dev react-devtools
react-devtools  # En otra terminal
```

---

## 📚 Recursos

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Actualizado: Enero 2026 — App lista para desarrollo y beta testing.*
