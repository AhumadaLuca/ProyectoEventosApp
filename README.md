# 🎟️ Eventos_App — Aplicación de Eventos Interactivos

Una aplicación web que permite visualizar eventos en un mapa interactivo, administrar organizadores y eventos mediante un sistema con CRUD completo, autenticación mediante JWT y un panel de administración para moderación.

---

## 🚀 Tecnologías utilizadas

### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Leaflet.js (Mapas interactivos)
- Fetch API para comunicación con el backend
- Módulos JS para UI (toasts, panel admin, modales, etc.)

### **Backend**
- Java Spring Boot (API REST)
- JPA / Hibernate
- MySQL
- Spring Security + JWT
- DTOs para Request/Response

---

## ⚙️ Funcionalidades principales

### 🌍 **Eventos**
- Visualización de eventos en un mapa dinámico (Leaflet.js)
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Validación de fechas de inicio/fin
- Gestión de precios (eventos gratuitos o pagos)
- Búsqueda por ubicación (Nominatim API)
- Modal de detalle para ver información extendida
- Opción de requerir verificación de edad
- Soporte para enlaces externos (venta de tickets, redes, etc.)

### 👤 **Organizadores**
- Registro y Login mediante JWT
- CRUD completo para organizadores
- Validación desde un administrador
- *Próximamente: vista de perfil y edición*

### 🛡️ **Administración**
- **AdminInitializer** que crea un usuario administrador por defecto
- Panel de administración (UI)
- Verificación de organizadores
- Validación/moderación de eventos
- Acceso a CRUD de eventos y organizadores (sin creación directa)

---

## 🧱 Arquitectura principal

### DTOs implementados
- `RegistroOrganizadorDTO` (Request/Response)
- `LoginOrganizadorDTO` (Request/Response)
- `EventoDTO` (Request/Response)
- `EventoAdminDTO`

### Backend
- Controladores para organizadores, eventos y administrador
- Servicios con lógica de negocio separada
- Repositories para `Evento`, `Organizador` y `Categoria`
- Filtros y configuración JWT
- Modales, fetchs y vistas diferenciadas según rol

### Frontend
- JS modularizado (UI, toasts, panel admin)
- Modales HTML para manejo de GET, acciones y roles
- Integración completa con endpoints del backend

---

## 📘 Registro de versiones (resumen)

- **v0.3.0 — Gran actualización:**  
  DTOs, CRUD completo de organizadores y eventos, JWT, panel admin, initializer, repositorios, modales y actualización profunda del frontend.

- **v0.2.0 — Funciones base:**  
  CREATE y READ de eventos, visualización en el mapa y separación inicial de JS.

- **v0.1.0 — Prototipo inicial:**  
  Configuración base de backend, estructura inicial de frontend, vista preliminar.

---

## ▶️ Estado actual del proyecto
✔ En desarrollo activo  
✔ API funcional  
✔ CRUD completo de entidades principales  
✔ Autenticación y roles implementados  
⚠ Pendiente: vista/edición del perfil del organizador  
⚠ Pendiente: refinado del flujo de validación por parte del admin  

---

## 📌 Futuras mejoras
- Edición del perfil de organizador
- Creación de organizadores/eventos desde admin (opcional)
- Dashboard de estadísticas
- Mejoras en UI del panel administrador
- Tests unitarios y de integración

---

## 📄 Licencia
Proyecto académico — uso libre con fines educativos.