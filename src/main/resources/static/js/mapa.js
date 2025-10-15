// Crear mapa centrado en Mendoza
    const map = L.map('map', {
      zoomControl: false
    }).setView([-32.889, -68.845], 13);

    // Cargar tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    //Botones de manejar zoom parte inferior derecha
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Marker de ejemplo (evento)
    L.marker([-32.889, -68.845])
      .addTo(map)
      .bindPopup(
        '<b>Concierto de Rock</b><br>22 de Noviembre<br><button>Ver más</button>');
    

    L.marker([-32.880, -68.845])
      .addTo(map)
      .bindPopup("<b>Feria de Culturas</b><br>24 de Noviembre");

      L.marker([-32.880, -68.840])
      .addTo(map)
      .bindPopup("<b>Bar y Restaurante</b><br>24 de Noviembre");
      
      L.marker([-32.880, -68.830])
      .addTo(map)
      .bindPopup("<b>Boliche</b><br>24 de Noviembre");

//Agregar Evento Map
let mapaUbicacion;
let marcador = null;

document.addEventListener("DOMContentLoaded", function () {
  // Inicializamos mapa centrado en Buenos Aires
  mapaUbicacion = L.map('mapaUbicacion').setView([-32.889, -68.845], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapaUbicacion);

  // Colocar marcador al hacer click en el mapa
  mapaUbicacion.on('click', function(e) {
    colocarMarcador(e.latlng.lat, e.latlng.lng);
  });

  // Buscar dirección con OpenCage
  document.getElementById("btnBuscarDireccion").addEventListener("click", buscarDireccion);

  // Cuando el modal se abra, arreglamos tamaño
  const modal = document.getElementById('nuevoEventoModal');
  modal.addEventListener('shown.bs.modal', function () {
    mapaUbicacion.invalidateSize();
  });
});

function buscarDireccion() {
  const direccion = document.getElementById("inputDireccion").value;
  if (!direccion) return;

  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(direccion)}&key=518f60686f5d43a6bc01e33e4eabb975`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        const lat = data.results[0].geometry.lat;
        const lng = data.results[0].geometry.lng;
        colocarMarcador(lat, lng);
        mapaUbicacion.setView([lat, lng], 15);
      } else {
        alert("No se encontró la dirección. Puedes marcarla manualmente en el mapa.");
      }
    })
    .catch(err => console.error("Error al buscar dirección:", err));
}

function colocarMarcador(lat, lng) {
  if (!marcador) {
    marcador = L.marker([lat, lng], { draggable: true }).addTo(mapaUbicacion);

    // Actualizamos coordenadas al mover marcador
    marcador.on('dragend', function(e) {
      const pos = e.target.getLatLng();
      actualizarCoordenadas(pos.lat, pos.lng);
    });
  } else {
    marcador.setLatLng([lat, lng]);
  }

  actualizarCoordenadas(lat, lng);
}

function actualizarCoordenadas(lat, lng) {
  document.getElementById('latitud').value = lat;
  document.getElementById('longitud').value = lng;
}

document.getElementById("formNuevoEvento").addEventListener("submit", function (event) {
  event.preventDefault(); // Evita el envío real

  // Obtenemos todos los campos del formulario
  const formData = new FormData(event.target);
  const evento = Object.fromEntries(formData.entries());

  // Convertimos los valores numéricos
  if (evento.latitud) evento.latitud = parseFloat(evento.latitud);
  if (evento.longitud) evento.longitud = parseFloat(evento.longitud);

  // Mostramos el JSON resultante en consola
  console.log("📦 Datos del evento:", JSON.stringify(evento, null, 2));
});