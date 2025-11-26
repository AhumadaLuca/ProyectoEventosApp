export function limpiarFormularioGenerico(formSelector, options = {}) {

	const {
		resetTitulo = true,
		resetBoton = true,
		idTitulo,
		textoTitulo = "Nuevo",
		idBoton,
		textoBoton = "Guardar",
		previewImagenSelector
	} = options;

	const form = document.querySelector(formSelector);
	if (!form) return;

	// Reset nativo del form
	form.reset();

	// Borrar atributos dataset internos
	for (const key in form.dataset) {
		delete form.dataset[key];
	}

	// Limpiar clases de error
	form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
	form.querySelectorAll(".invalid-feedback, .text-danger").forEach(el => {
		el.textContent = "";
		el.classList.add("d-none");
	});

	// Limpiar inputs ocultos
	form.querySelectorAll("input[type=hidden]").forEach(h => h.value = "");

	// Limpiar preview de imagen (si se especifica)
	if (previewImagenSelector) {
		const img = document.querySelector(previewImagenSelector);
		if (img) img.style.display = "none";
	}

	// Resetear título del modal
	if (resetTitulo && idTitulo) {
		const titulo = document.getElementById(idTitulo);
		if (titulo) titulo.textContent = textoTitulo;
	}

	// Resetear texto del botón
	if (resetBoton && idBoton) {
		const boton = document.getElementById(idBoton);
		if (boton) {
			boton.textContent = textoBoton;
			boton.disabled = false;
		}
	}

	console.log("🧹 Formulario limpio:", formSelector);
}