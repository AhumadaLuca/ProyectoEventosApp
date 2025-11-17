
export async function initAdminPanel() {
	const tbody = document.getElementById("eventosAdminBody");
	if (!tbody) return console.error("No se encontró #eventosAdminBody en el DOM");

	tbody.innerHTML = `<tr><td colspan="8" class="text-center">Cargando...</td></tr>`;

	try {
		const resp = await fetch("http://localhost:8080/api/admin/eventos", {
			headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
		});

		if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

		const eventos = await resp.json(); // array de eventos con datos de organizador
		if (!Array.isArray(eventos) || eventos.length === 0) {
			tbody.innerHTML = `<tr><td colspan="8" class="text-center">No hay eventos.</td></tr>`;
			return;
		}

		tbody.innerHTML = "";
		eventos.forEach(ev => {
			console.log(ev);
			const organizadorNombre = ev.nombreOrganizador || (ev.organizador ? `${ev.organizador.nombre} ${ev.organizador.apellido}` : "—");
			const organizadorEmail = ev.organizador?.email || ev.emailOrganizador || "—";

			const fi = ev.fechaInicio ? ev.fechaInicio.substring(0, 16).replace("T", " ") : "—";
			const ff = ev.fechaFin ? ev.fechaFin.substring(0, 16).replace("T", " ") : "—";

			const tr = document.createElement("tr");
			tr.innerHTML = `
        <td>${ev.id}</td>
        <td>
          <strong>${escapeHtml(ev.titulo || "—")}</strong>
          <div class="text-muted small">${escapeHtml(ev.descripcion ? ev.descripcion.slice(0, 120) : "")}</div>
        </td>
        <td>${escapeHtml(ev.categoria || "—")}</td>
        <td>${fi}<br><small class="text-muted">${ff}</small></td>
        <td>
          <div>${escapeHtml(organizadorNombre)}</div>
          <div class="text-muted small">${escapeHtml(organizadorEmail)}</div>
          ${ev.organizador?.verificado || ev.verificadoOrganizador ? '<span class="badge bg-success">Verificado</span>' : '<span class="badge bg-secondary">No verificado</span>'}
        </td>
        <td>${ev.validado ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-warning text-dark">No</span>'}</td>
        <td>
          <button class="btn btn-sm btn-primary btn-validar-evento" data-id="${ev.id}">${ev.validado ? 'Invalidar' : 'Validar'}</button>
          <button class="btn btn-sm btn-warning btn-editar-evento" data-bs-toggle="modal" data-bs-target="#nuevoEventoModal" data-id="${ev.id}">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar-evento" data-id="${ev.id}">Eliminar</button>
        </td>
        <td>
        ${!ev.verificadoOrganizador
					? `<button class="btn btn-sm btn-success btn-ver-organizador" data-organizador-id="${ev.organizadorId}">Verificar</button>`
					: `<button class="btn btn-sm btn-warning btn-ver-organizador" data-organizador-id="${ev.organizadorId}">Revocar Verificar</button>`
				}
          
          <button class="btn btn-sm btn-danger btn-eliminar-organizador" data-organizador-id="${ev.organizadorId}">Eliminar</button>
        </td>
      `;
			tbody.appendChild(tr);
		});

	} catch (err) {
		console.error("Error cargando admin panel:", err);
		tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error cargando datos.</td></tr>`;
	}

}

document.addEventListener("click", async (e) => {
		// Confirmar validacion evento
		if (e.target.matches(".btn-confirmar-validar-evento")) {
			const id = e.target.dataset.id;
			if (!id) return;
			if (!confirm("¿Confirmás la validación de este evento?")) return;
			try {
				const response = await fetch(`http://localhost:8080/api/admin/eventos/validar/${id}`, {
					method: "PUT",
					headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
				});
				if (response.ok) {
					alert("☑️ Evento validado correctamente");
					initAdminPanel();
				} else {
					alert("❌ No se pudo validar el evento");
				}
				initAdminPanel();
			} catch (err) {
				console.error("Error al validar el evento:", err);
				alert("Error al validar el evento");
			}
		}

		// Ver organizador para verificar
		if (e.target.matches(".btn-ver-organizador")) {

			const orgId = e.target.dataset.organizadorId;

			try {
				const response = await fetch(`http://localhost:8080/api/admin/organizadores/ver/${orgId}`, {
					method: "GET",
					headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
				});
				if (!response.ok) { throw new Error("No se pudo obtener el organizador"); }

				const org = await response.json();
				console.log(org);
				console.log(org.id);

				const modal = document.getElementById("modalDetalleEvento");
				const modalBody = document.getElementById("modalDetalleBody");
				const modalFooter = modal.querySelector(".modal-footer");

				modalBody.innerHTML = `
      <div class="text-center">
        <img src="${org.fotoPerfil}" class="img-fluid rounded-circle mb-3" 
             style="width: 120px; height: 120px; object-fit: cover;">
        <h4>${org.nombre} ${org.apellido}</h4>
        <p><b>Email:</b> ${org.email}</p>
        <p><b>Teléfono:</b> ${org.telefono}</p>
        <p><b>Fecha de nacimiento:</b> ${org.fechaNacimiento}</p>
        <p><b>Organización:</b> ${org.nombreOrganizacion}</p>
        <p><b>Dirección:</b> ${org.direccionOrganizacion}</p>
        <p><b>Rol:</b> ${org.rol}</p>
        <p><b>Registrado el:</b> ${org.fechaRegistro}</p>
        <p><b>Verificado:</b> ${org.verificado ? "✅ Sí" : "❌ No"}</p>
      </div>
    `;


				modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-volver-admin" data-bs-dismiss="modal">
        Volver al Panel
      </button>
      ${!org.verificado
						? `<button class="btn btn-success btn-verificar-organizador" data-bs-dismiss="modal" data-id="${org.id}">
              Verificar Organizador
            </button>`
						: `<button class="btn btn-warning btn-verificar-organizador" data-bs-dismiss="modal" data-id="${org.id}">
              Revocar Verificar Organizador
            </button>`
					}
    `;
				const panelModal = bootstrap.Modal.getInstance(document.getElementById("adminPanelModal"));
				if (panelModal) {
					panelModal.hide();
				}
				new bootstrap.Modal(modal).show();

				modalFooter.querySelector(".btn-volver-admin").addEventListener("click", () => {
					// detalleModal.hide();
					const modalAdmin = new bootstrap.Modal(document.getElementById("adminPanelModal"));
					modalAdmin.show();
				});

			} catch (err) {
				console.error("Error:", err);
				alert("Error");
			}
			return;
		}

		if (e.target.matches(".btn-verificar-organizador")) {

			const orgId = e.target.dataset.id;
			if (!confirm("¿Confirmás la validación de este organizador?")) return;
			try {
				const response = await fetch(`http://localhost:8080/api/admin/organizadores/verificar/${orgId}`, {
					method: "PUT",
					headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
				});
				if (!response.ok) { throw new Error("No se pudo verificar el organizador"); }

				alert("☑️ Organizador verificado correctamente");
				new bootstrap.Modal(document.getElementById("adminPanelModal")).show();
			} catch {

			}
		}

		// Eliminar organizador
		if (e.target.matches(".btn-eliminar-organizador")) {
			const orgId = e.target.dataset.organizadorId;
			if (!confirm("¿Eliminar organizador y todos sus eventos?")) return;
			try {
				const resp = await fetch(`http://localhost:8080/api/admin/organizadores/eliminar/${orgId}`, {
					method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
				});
				if (!resp.ok) throw new Error("Error al eliminar organizador");
				
				alert("☑️ Organizador y sus eventos eliminados correctamente");
				new bootstrap.Modal(document.getElementById("adminPanelModal")).show();
			} catch (err) { console.error(err); alert("Error eliminando organizador"); }
			return;
		}

	});

// helpers seguros (escape)
function escapeHtml(str) {
	if (!str) return "";
	return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}
