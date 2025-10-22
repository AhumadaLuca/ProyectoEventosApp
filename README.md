# 🗺️ Proyecto: App de Eventos Interactivos

Una aplicación web que muestra **eventos en un mapa interactivo**, permitiendo ver información detallada, crear nuevos eventos y gestionar sus datos desde un CRUD completo.

---

## 🚀 Tecnologías utilizadas

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5  
- Leaflet.js (mapas interactivos)

**Backend**
- Java Spring Boot (API REST)
- JPA / Hibernate  
- MySQL

---

## ⚙️ Funcionalidades principales

- 📍 Visualización de eventos en mapa dinámico  
- 📝 CRUD completo (crear, leer, actualizar, eliminar eventos)  
- 🕒 Validaciones de fechas de inicio y fin  
- 💵 Control de precios, eventos gratuitos o pagos  
- 🧭 Búsqueda por ubicación (geolocalización con Leaflet + Nominatim API)  
- 🧾 Visualización detallada en modal  
- 🧒 Opción para requerir verificación de edad  
- 🌐 Soporte para enlaces externos (venta de entradas, etc.)

---

## 🧩 Estructura del proyecto

ProyectoEventosApp/
├── backend/
│ ├── src/main/java/com/eventosapp/
│ │ ├── controller/
│ │ ├── model/
│ │ ├── repository/
│ │ └── service/
│ └── resources/application.properties
│
├── frontend/
│ ├── index.html
│ ├── js/
│ │ ├── eventos.js
│ │ ├── mapa.js
│ │ ├── ubicacion.js
│ │ ├── utils.js
│ │ └── formularioEvento.js
│ └── css/
│ └── estilo.css
│
└── README.md

📘 Registro de versiones

🟢 Eventos_App v0.2.0

Se agregó la funcionalidad de CREATE y READ de eventos para poder visualizar los eventos en el mapa y ver algunos de sus datos.
Además, se realizó una reorganización interna de los archivos JS, separándolos en módulos independientes para un código más limpio y mantenible.

🟢 Eventos_App v0.1.0

Comienzo del prototipo del proyecto con configuraciones básicas, algunos ajustes y agregados en el Backend y un Frontend mostrando lo "esperado" para la versión final.
