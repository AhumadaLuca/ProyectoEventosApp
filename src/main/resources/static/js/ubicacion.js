// 📄 js/ubicacion.js

let mapaUbicacion = null;
let marcador = null;

export function initUbicacionModal() {
  const modal = document.getElementById('nuevoEventoModal');
  const mapaDiv = document.getElementById('mapaUbicacion');
  if (!modal || !mapaDiv) return;

  // Inicializar mapa del modal
  mapaUbicacion = L.map('mapaUbicacion').setView([-32.889, -68.845], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapaUbicacion);

  // Evento al hacer clic en el mapa
  mapaUbicacion.on('click', e => colocarMarcador(e.latlng.lat, e.latlng.lng));

  // Ajustar tamaño al abrir modal
  modal.addEventListener('shown.bs.modal', () => {
    setTimeout(() => mapaUbicacion.invalidateSize(), 200);
  });

  // Botón de buscar dirección
  const btnBuscar = document.getElementById("btnBuscarDireccion");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", buscarDireccion);
  }
}

// 🔹 Función auxiliar interna (no global)
function colocarMarcador(lat, lng) {
  if (!marcador) {
    marcador = L.marker([lat, lng], { draggable: true }).addTo(mapaUbicacion);
    marcador.on('dragend', e => {
      const pos = e.target.getLatLng();
      actualizarCoordenadas(pos.lat, pos.lng);
    });
  } else {
    marcador.setLatLng([lat, lng]);
  }
  actualizarCoordenadas(lat, lng);
}

function actualizarCoordenadas(lat, lng) {
  document.getElementById('eventoLatitud').value = lat;
  document.getElementById('eventoLongitud').value = lng;
}

function buscarDireccion() {
  const direccion = document.getElementById("eventoDireccion").value;
  if (!direccion) return;

  fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(direccion)}&key=518f60686f5d43a6bc01e33e4eabb975`)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        colocarMarcador(lat, lng);
        mapaUbicacion.setView([lat, lng], 15);
      } else {
        alert("No se encontró la dirección. Puedes marcarla manualmente en el mapa.");
      }
    })
    .catch(err => console.error("Error al buscar dirección:", err));
}