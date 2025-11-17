# Changelog
Todos los cambios notables de este proyecto se documentan en este archivo.

---

## [v0.3.0] - 2025-11-17

### Añadido
- Sistema completo de autenticación:
  - Configuración de JWT (config + filter)
  - Filtros de autorización por rol (organizador/admin)
- Paquete de DTOs:
  - RegistroOrganizadorDTO (Req/Res)
  - LoginOrganizadorDTO (Req/Res)
  - EventoDTO (Req/Res)
  - EventoAdminDTO
- CRUD completo:
  - Eventos: crear, leer, actualizar, eliminar
  - Organizadores: crear, leer, actualizar, eliminar
- AdminInitializer:
  - Crea un usuario administrador por defecto
- Funcionalidades del Admin:
  - Verificar organizadores
  - Validar eventos
  - Acceso a CRUD (excepto creación de organizadores/eventos)
- Repositories añadidos:
  - CategoriaRepository
  - EventoRepository
  - OrganizadorRepository
- Frontend:
  - Fetch para todos los endpoints implementados
  - Panel de administración con acciones para eventos y organizadores
  - Sistema de toasts genérico reutilizable
  - Archivos JS modularizados para UI
- HTML:
  - Modales para GET/UPDATE/DELETE según rol (anónimo, organizador, admin)
  - Ajustes en estructura para nuevas funciones

### Mejorado
- Refactor general del frontend para adaptarse a nuevas funciones
- Actualización de controladores y servicios para soportar DTOs
- Mejoras de mantenibilidad y limpieza del código en JS
- Archivo JS principal en donde se importa el resto del código JS

### Corregido
- Ajustes para evitar inconsistencias en las operaciones CRUD
- Correcciones menores en eventos y validaciones de fechas

### Pendiente
- Vista y edición del perfil del organizador (planeado)
- Se evaluará si el admin podrá crear organizadores/eventos en futuras versiones
- Filtrado de eventos en el mapa

---

## [v0.2.0] - 2025-10-22
### Añadido
- Funcionalidad CREATE y READ de eventos
- Visualización de eventos en mapa con Leaflet.js

### Mejorado
- Separación inicial de archivos JS en módulos

---

## [v0.1.0] - 2025-10-15
### Añadido
- Protótipo inicial del proyecto
- Configuración base en backend y frontend