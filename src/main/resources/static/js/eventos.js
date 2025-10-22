// eventos.js
import { formatearFecha } from './utils.js';

export async function cargarEventos(map) {
  try {
    const resp = await fetch("http://localhost:8080/api/eventos");
    const eventos = await resp.json();

    eventos.forEach(evento => {
      // Crear un div real
      const popupDiv = document.createElement('div');
      popupDiv.style.width = '230px';
      popupDiv.style.fontFamily = "'Inter', sans-serif";
      popupDiv.style.color = '#333';
      popupDiv.style.borderRadius = '8px';
      popupDiv.style.overflow = 'hidden';
      popupDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      popupDiv.style.background = '#fff';

      // Inner HTML de la imagen y contenido
      popupDiv.innerHTML = `
        ${evento.imagenUrl ? `
          <img src="${evento.imagenUrl}" alt="${evento.titulo}" 
            style="width:100%; height:120px; object-fit:cover; display:block; border-bottom:1px solid #eee;">
        ` : `
          <div style="width:100%; height:120px; background:#ccc;"></div>
        `}
        <div style="padding:8px 10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h6 style="margin:0; font-weight:600; font-size:14px;">${evento.titulo}</h6>
            <span style="font-weight:600; color:#007bff; font-size:13px;">
              ${evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}
            </span>
          </div>
          <p style="margin:0; font-size:12px; color:#666;">
            <b>📅</b> ${formatearFecha(evento.fechaInicio)}
          </p>
        </div>
      `;

      // Crear botón con listener
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-primary mt-2';
      btn.style.width = '100%';
      btn.style.fontSize = '13px';
      btn.style.borderRadius = '6px';
      btn.style.padding = '4px 0';
      btn.textContent = 'Ver más';
      btn.addEventListener('click', () => verDetalles(evento.id));

      popupDiv.appendChild(btn);

      // Agregar el popup al marker
      L.marker([evento.latitud, evento.longitud])
        .addTo(map)
        .bindPopup(popupDiv);
    });

  } catch (err) {
    console.error("❌ Error cargando eventos:", err);
  }
}

export async function verDetalles(eventoId) {
  try {
    const res = await fetch(`http://localhost:8080/api/eventos/${eventoId}`);
    const evento = await res.json();

    const modalBody = `
      <h5>${evento.titulo}</h5>
      <p><b>Descripción:</b> ${evento.descripcion}</p>
      <p><b>Fecha:</b> ${formatearFecha(evento.fechaInicio)} - ${formatearFecha(evento.fechaFin)}</p>
      <p><b>Ubicación:</b> ${evento.ubicacion || 'No especificada'}</p>
      <p><b>Precio:</b> ${evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}</p>
      ${evento.imagenUrl ? `<img src="${evento.imagenUrl}" style="width:100%; border-radius:4px;">` : ''}
      <p><b>Verificación de edad:</b> ${evento.requiereVerificarEdad ? 'Sí' : 'No'}</p>
    `;
    document.getElementById("modalDetalleBody").innerHTML = modalBody;
    new bootstrap.Modal(document.getElementById("modalDetalleEvento")).show();
  } catch (err) {
    console.error("Error cargando detalle del evento:", err);
  }
}