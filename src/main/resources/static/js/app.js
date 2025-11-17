import { initMapa } from './mapa.js';
import { cargarEventos, verEventosOrganizador, verDetalles } from './eventos.js';
import { initUbicacionModal } from './ubicacion.js';
import { initFormularioEvento } from './formularioEvento.js';
import { initFormularioOrganizador } from './formularioOrganizador.js';
import { actualizarMenuUsuario } from './AuthUI.js';
import { initAdminPanel } from './adminPanel.js';

export function iniciarApp() {
	const map = initMapa();
	window.mapInstance = map;
	cargarEventos(map); // Solo los públicos, esto sí se puede cargar al inicio
	initFormularioEvento();
	actualizarMenuUsuario();
	initUbicacionModal();
	initFormularioOrganizador();

	// Delegar acciones por botones o tabs
	const modalMisEventos = document.getElementById("modalAdministrarEventosOrganizador");
	if (modalMisEventos) {
		modalMisEventos.addEventListener("shown.bs.modal", () => verEventosOrganizador());
	}

	const modalAdministrador = document.getElementById("adminPanelModal");
	if (modalAdministrador) {
		modalAdministrador.addEventListener("shown.bs.modal", () => initAdminPanel());
	}

	document.addEventListener("click", async (e) => {
		if (e.target.classList.contains("btn-validar-evento")) {
			const id = e.target.dataset.id;

			const modalAdmin = bootstrap.Modal.getInstance(document.getElementById("adminPanelModal"));
			if (modalAdmin) modalAdmin.hide();

			// 🔹 Abrir el modal de detalle
			await verDetalles(id, true);
		}
	});
}