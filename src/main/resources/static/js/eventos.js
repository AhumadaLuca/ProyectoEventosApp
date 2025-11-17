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
          <p style="margin:0; margin-top:5px;"><b>Validado:</b> ${evento.validado ? '☑️' : '❌'}</p>
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

export async function verDetalles(eventoId, modoAdmin = false) {
	try {
		const res = await fetch(`http://localhost:8080/api/eventos/${eventoId}`);
		if (!res.ok) throw new Error("No se pudo obtener el evento");
		const evento = await res.json();
		
		console.log(evento);

		const modal = document.getElementById("modalDetalleEvento");
		const modalBody = document.getElementById("modalDetalleBody");
		const modalFooter = modal.querySelector(".modal-footer");

		modalBody.innerHTML = `
      <h5>${evento.titulo}</h5>
      <p><b>Descripción:</b> ${evento.descripcion}</p>
      <p><b>Fecha:</b> ${formatearFecha(evento.fechaInicio)} - ${formatearFecha(evento.fechaFin)}</p>
      <p><b>Ubicación:</b> ${evento.ubicacion || 'No especificada'}</p>
      <p><b>Precio:</b> ${evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}</p><p><b>Verificación de edad:</b> ${evento.requiereVerificarEdad ? 'Sí' : 'No'}</p>
      <p><b>Link externo:</b>${evento.urlVentaExterna || 'No disponible'}</p>
      <p><b>Organizador:</b> ${evento.nombreOrganizador || 'Desconocido'}</p>
      <p><b>Validado:</b> ${evento.validado ? '☑️ Sí' : '❌ No'}</p>
      ${evento.imagenUrl ? `<img src="${evento.imagenUrl}" style="width:100%; border-radius:4px;">` : ''}
      ${modoAdmin
				? `<div class="text-center mt-3">
               ${evento.validado
					? `<button class="btn btn-warning btn-confirmar-validar-evento" data-id="${evento.id}">Invalidar Evento</button>`
					: `<button class="btn btn-success btn-confirmar-validar-evento" data-id="${evento.id}">Validar Evento</button>`
				}
             </div>`
				: ""
			}
    `;

		if (modoAdmin) {
			modalFooter.innerHTML = `
        <button class="btn btn-secondary btn-volver-admin" data-bs-dismiss="modal">Volver al Panel</button>
      `;
		} else {
			modalFooter.innerHTML = `
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      `;
		}


		if (modoAdmin) {
			modalFooter.querySelector(".btn-volver-admin").addEventListener("click", () => {
				// detalleModal.hide();
				const modalAdmin = new bootstrap.Modal(document.getElementById("adminPanelModal"));
				modalAdmin.show();
			});
		}
		// 🔥 Mostrar el modal
		new bootstrap.Modal(document.getElementById("modalDetalleEvento")).show();

	} catch (err) {
		console.error("Error cargando detalle del evento:", err);
	}
}

export async function verEventosOrganizador() {
	const token = localStorage.getItem('token');
	const tabla = document.getElementById("tablaEventosOrganizador").querySelector("tbody");

	tabla.innerHTML = "<tr><td colspan='8' class='text-center'>Cargando eventos...</td></tr>";

	try {
		const response = await fetch("http://localhost:8080/api/eventos/mis-eventos", {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		});

		if (!response.ok) {
			tabla.innerHTML = "<tr><td colspan='8' class='text-center text-danger'>Error al obtener los eventos.</td></tr>";
			return;
		}

		const eventos = await response.json();

		if (!eventos || eventos.length === 0) {
			tabla.innerHTML = "<tr><td colspan='8' class='text-center'>No hay eventos cargados.</td></tr>";
			return;
		}

		// Limpio la tabla antes de llenar
		tabla.innerHTML = "";

		// Recorro y agrego cada evento
		eventos.forEach(evento => {
			const fila = document.createElement("tr");
			console.log(evento);
			fila.innerHTML = `
        <td>${evento.titulo || "-"}</td>
        <td>${evento.descripcion || "-"}</td>
        <td>${evento.categoria.nombre || "-"}</td>
        <td>${evento.ubicacion || "-"}</td>
        <td>${formatearFecha(evento.fechaCreacion)}</td>
    	<td>${formatearFecha(evento.fechaInicio)}</td>
    	<td>${formatearFecha(evento.fechaFin)}</td>
        <td>
          ${evento.imagenUrl ? `<img src="${evento.imagenUrl}" alt="Imagen" style="max-width: 100px; border-radius: 6px;">` : "-"}
        </td>
        <td>${evento.precio ? "$" + evento.precio : "Gratis"}</td>
        <td>
          ${evento.urlVentaExterna ? `<a href="${evento.urlVentaExterna}" target="_blank" rel="noopener noreferrer">Ver enlace</a>` : "No disponible"}
        </td>
        <td>${evento.requiereVerificarEdad ? "Sí" : "No"}</td>
        <td>${evento.validado ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar-evento" data-bs-toggle="modal" data-bs-target="#nuevoEventoModal" data-id="${evento.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar-evento" data-id="${evento.id}">Eliminar</button>
        </td>
      `;

			tabla.appendChild(fila);
		});

	} catch (error) {
		console.error("Error al cargar eventos:", error);
		tabla.innerHTML = "<tr><td colspan='8' class='text-center text-danger'>Error de conexión al servidor.</td></tr>";
	}
}

