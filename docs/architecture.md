# Arquitectura del proyecto (Resumen)

## Mobile (NutriApp)
- Organización por features (`src/features/*`) y capas (`core`, `domain`, `shared`).
- Principios: separación de responsabilidades y testabilidad; se alinea con ideas de Clean Architecture a nivel de capas (UI, domain/dto, data/api).

## Backend
- Django por apps (`apps/users`, `apps/clinical`, `apps/nutrition`) — patrón MTV (equivalente funcional a MVC).
- APIs CRUD expuestas con Django REST Framework.

## ¿Es Clean Architecture o MVC?
- La app móvil sigue un estilo cercano a Clean Architecture (separación de dominio, lógica y UI).
- El backend sigue el patrón tradicional de Django (MTV), que se ajusta bien a soluciones modulares y es adecuado para un portafolio.
