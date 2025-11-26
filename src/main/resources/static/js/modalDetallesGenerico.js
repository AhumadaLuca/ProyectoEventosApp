export function abrirModalDetalle({ titulo, cuerpoHTML, botonesHTML }) {

	const modal = document.getElementById("modalDetalleGenerico");
	const tituloModal = modal.querySelector(".modal-title");
	const body = document.getElementById("modalDetalleBody");
	const footer = modal.querySelector(".modal-footer");

	tituloModal.textContent = titulo;
	body.innerHTML = cuerpoHTML;
	footer.innerHTML = botonesHTML;

	new bootstrap.Modal(modal).show();
}