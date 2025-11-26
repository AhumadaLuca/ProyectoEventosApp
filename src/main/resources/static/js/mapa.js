// 📍 js/mapa.js

let map = null;

export function initMapa() {
  // Evitar reinicializar si ya existe
  if (map) return map;

  // Crear mapa centrado en Mendoza
  map = L.map('map', { zoomControl: false }).setView([-32.889, -68.845], 13);

  // Cargar tiles de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Agregar control de zoom abajo a la derecha
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  
  // 🆕 Crear un LayerGroup global para manejar los marcadores del mapa
  window.eventMarkersLayer = L.layerGroup().addTo(map);

  console.log("🗺️ Mapa inicializado correctamente");
  return map;
}