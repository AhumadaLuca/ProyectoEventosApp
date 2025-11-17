
import { cargarEventos } from './eventos.js';
import { verEventosOrganizador } from './eventos.js';

export function initFormularioEvento() {

	const form = document.getElementById("formEvento");
	if (!form) return;

	const errBox = document.getElementById("eventoError");

	// escuchar inputs una sola vez (no dentro del submit)
	form.addEventListener("input", (e) => {
		if (e && e.target && e.target.id) clearFieldError(e.target.id);
		if (errBox) {
			errBox.classList.add("d-none");
			errBox.innerText = "";
		}
	});

	// helpers
	function showFieldError(inputId, msg) {
		const input = document.getElementById(inputId);
		const error = document.getElementById("error" + inputId.replace("evento", ""));
		if (!input || !error) return;
		input.classList.add("is-invalid");
		error.textContent = msg;
		error.classList.remove("d-none");
	}

	function clearFieldError(inputId) {
		const input = document.getElementById(inputId);
		const error = document.getElementById("error" + inputId.replace("evento", ""));
		if (!input || !error) return;
		input.classList.remove("is-invalid");
		error.textContent = "";
		error.classList.add("d-none");
	}
	
console.log("🎯 initFormularioOrganizador cargado correctamente");
	// GUARDAR EVENTO
	form.addEventListener("submit", async function(e) {
		e.preventDefault();

		const btnGuardar = document.querySelector("#btnGuardarEvento");
		btnGuardar.disabled = true;
		btnGuardar.textContent = "Guardando...";
		try {
			// Capturar campos
			const titulo = document.getElementById("eventoTitulo").value.trim();
			const descripcion = document.getElementById("eventoDescripcion").value.trim();
			const categoriaId = parseInt(document.getElementById("eventoCategoriaId").value);
			const fechaInicio = new Date(document.getElementById("eventoFechaInicio").value);
			const fechaFin = new Date(document.getElementById("eventoFechaFin").value);
			const ubicacion = document.getElementById("eventoDireccion").value.trim();
			const latitud = parseFloat(document.getElementById("eventoLatitud").value);
			const longitud = parseFloat(document.getElementById("eventoLongitud").value);
			const precio = parseFloat(document.getElementById("eventoPrecio").value.trim());
			const urlVentaExterna = document.getElementById("eventoUrlVentaExterna").value.trim();
			const requiereVerificarEdad = !!document.getElementById("eventoRequiereVerificarEdad")?.checked;
			const imagenUrl = document.getElementById("eventoImagen")?.files?.[0];

			let hasError = false;

			// Validaciones principales
			if (!titulo) { showFieldError("eventoTitulo", "El título es obligatorio"); hasError = true; }
			if (!descripcion) { showFieldError("eventoDescripcion", "La descripción es obligatoria"); hasError = true; }

			if (isNaN(categoriaId)) { showFieldError("eventoCategoriaId", "Seleccione una categoria"); hasError = true; }

			const now = new Date();
			if (isNaN(fechaInicio) || isNaN(fechaFin)) {
				showFieldError("eventoFechaInicio", "Debes ingresar fechas válidas");
				hasError = true;
			} else {
				if (fechaInicio < now) { showFieldError("eventoFechaInicio", "La fecha de inicio no puede estar en el pasado"); hasError = true; }
				if (fechaFin <= fechaInicio) { showFieldError("eventoFechaFin", "La fecha de fin debe ser posterior a la fecha de inicio"); hasError = true; }
			}

			if (!ubicacion) { showFieldError("eventoDireccion", "La dirección es obligatoria"); hasError = true; }
			if (isNaN(latitud) || isNaN(longitud)) { showFieldError("eventoDireccion", "Selecciona una ubicación en el mapa"); hasError = true; }

			if (precio !== "" && (isNaN(precio) || precio < 0)) {
				showFieldError("eventoPrecio", "El precio debe ser un número válido o vacío si es gratis");
				hasError = true;
			}

			// Validación URL
			if (urlVentaExterna) {
				try { new URL(urlVentaExterna); }
				catch { showFieldError("eventoUrlVentaExterna", "La URL externa no es válida"); hasError = true; }
			}

			// Validación imagen (opcional)
			if (imagenUrl) {
				const validExt = ["image/jpeg", "image/png", "image/webp"];

				if (!validExt.includes(imagenUrl.type)) {
					showFieldError("eventoImagen", "Formato de imagen inválido (JPG, PNG o WEBP)");
					hasError = true;
				}
				if (imagenUrl.size > 2 * 1024 * 1024) {
					showFieldError("eventoImagen", "La imagen no debe superar los 2MB");
					hasError = true;
				}
				const ok = await validarDimensionesImagen(imagenUrl);
				if (!ok) { showFieldError("eventoImagen", "La imagen debe ser mínimo 150x150 pixeles"); hasError = true; }
			}

			if (hasError) {
				return;
			}
			// Armar objeto evento plano
			const evento = {
				titulo,
				descripcion,
				fechaInicio,
				fechaFin,
				ubicacion,
				latitud,
				longitud,
				precio,
				urlVentaExterna,
				requiereVerificarEdad,
				categoriaId
			};

			// Preparar FormData final
			const data = new FormData();
			data.append("evento", new Blob([JSON.stringify(evento)], { type: "application/json" }));
			data.append("imagenUrl", imagenUrl);

			const token = localStorage.getItem("token");

			const idEvento = formEvento.dataset.idEvento; // ← se lee el atributo que guardamos antes
			const method = idEvento ? "PUT" : "POST";
			const url = idEvento
				? `http://localhost:8080/api/eventos/editar/${idEvento}`
				: `http://localhost:8080/api/eventos/guardar`;

			console.log("Empezando el guardado");

			const resp = await fetch(url, {
				method,
				headers: {
					"Authorization": `Bearer ${token}`
				},
				body: data
			});

			if (!resp.ok) throw new Error("Error al guardar el evento");

			alert(idEvento ? "Evento actualizado ✅" : "Evento creado ✅");
			// Limpia
			form.reset();

			// Cierra modal
			bootstrap.Modal.getInstance(document.getElementById("nuevoEventoModal")).hide();

			// Limpiar el formulario

			delete formEvento.dataset.idEvento;
			const modalLabel = document.querySelector("#nuevoEventoModalLabel");
			const btnGuardar = document.querySelector("#btnGuardarEvento");

			if (modalLabel) modalLabel.textContent = "Nuevo Evento";
			if (btnGuardar) btnGuardar.textContent = "Crear Evento";
			//Refrescamos mapa
			if (window.mapInstance) {
				cargarEventos(window.mapInstance);
			}

		} catch (err) {
			console.error("❌ Error al guardar:", err);
			alert("Error al guardar el evento: " + err.message);
		} finally {
			const btnGuardar = document.querySelector("#btnGuardarEvento");
			btnGuardar.disabled = false;
			btnGuardar.textContent = "Crear Evento";
		}
	});

	// TRAER EVENTO PARA EDITAR
	document.getElementById('nuevoEventoModal').addEventListener('show.bs.modal', async (e) => {

		const button = e.relatedTarget;
		if (!button || !button.classList.contains("btn-editar-evento")) return;

		const id = button.dataset.id;
		if (!id) return;

		try {
			const response = await fetch(`http://localhost:8080/api/eventos/${id}`);

			if (!response.ok) {
				throw new Error("No se pudo obtener el evento");
			}
			const evento = await response.json();
			
			console.log(evento);

			// 🧩 Cargar valores en los inputs del formulario
			document.getElementById("eventoTitulo").value = evento.titulo || "";
			document.getElementById("eventoDescripcion").value = evento.descripcion || "";
			document.getElementById("eventoCategoriaId").value = evento.categoria?.id || "";
			document.getElementById("eventoDireccion").value = evento.ubicacion || "";
			document.getElementById("eventoLatitud").value = evento.ubicacion?.latitud || "";
			document.getElementById("eventoLongitud").value = evento.ubicacion?.longitud || "";

			// 📅 Fechas (formato ISO local compatible con input type="datetime-local")
			if (evento.fechaInicio) {
				document.getElementById("eventoFechaInicio").value = evento.fechaInicio.substring(0, 16);
			}
			if (evento.fechaFin) {
				document.getElementById("eventoFechaFin").value = evento.fechaFin.substring(0, 16);
			}

			// 💲 Precio
			document.getElementById("eventoPrecio").value = evento.precio || "";

			// 🔗 URL de venta externa
			document.getElementById("eventoUrlVentaExterna").value = evento.urlVentaExterna || "";

			// 🔞 Verificación de edad
			document.getElementById("eventoRequiereVerificarEdad").checked = evento.requiereVerificarEdad || false;

			// 🖼️ Imagen
			const imagenPreview = document.getElementById("previewImagenEvento");
			if (imagenPreview && evento.imagenUrl) {
				imagenPreview.src = evento.imagenUrl;
				imagenPreview.style.display = "block";
			}

			// 💾 Guardamos el ID del evento en el formulario para saber que estamos editando
			const form = document.getElementById("formEvento");
			form.dataset.idEvento = evento.id;

			// 📝 Cambiar título del modal y texto del botón
			document.querySelector("#tituloModalEvento").textContent = "Editar Evento";
			document.querySelector("#btnGuardarEvento").textContent = "Guardar Cambios";

		} catch (error) {
			console.error("Error al cargar evento:", error);
			alert("No se pudo cargar la información del evento");
		}

	});

	// CONFIRMAR ELIMINACION	

	let eventoAEliminar = null;

	document.addEventListener("click", (e) => {
		// 🔴 Botón eliminar
		if (e.target.classList.contains("btn-eliminar-evento")) {
			eventoAEliminar = e.target.dataset.id;

			// Mostrar el modal de confirmación
			const modalEliminar = new bootstrap.Modal(document.getElementById("confirmarEliminarModal"));
			modalEliminar.show();

			// Personalizar mensaje (opcional)
			document.getElementById("mensajeEliminarEvento").textContent =
				`¿Seguro que deseas eliminar el evento #${eventoAEliminar}?`;
		}
	});

	// ⚡ Acción al confirmar eliminación
	document.getElementById("btnConfirmarEliminar").addEventListener("click", async () => {
		if (!eventoAEliminar) return;
		console.log(localStorage.getItem("token"));
		try {
			const response = await fetch(`http://localhost:8080/api/eventos/eliminar/${eventoAEliminar}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${localStorage.getItem("token")}` // si usás auth
				}
			});

			if (!response.ok) {
				throw new Error("No se pudo eliminar el evento");
			}

			// Cerrar el modal
			const modalEliminar = bootstrap.Modal.getInstance(document.getElementById("confirmarEliminarModal"));
			modalEliminar.hide();

			alert("✅ Evento eliminado correctamente");

			// Recargar la lista de eventos del organizador
			if (typeof verEventosOrganizador === "function") {
				verEventosOrganizador();
			}

		} catch (error) {
			console.error("Error al eliminar evento:", error);
			alert("❌ Ocurrió un error al intentar eliminar el evento");
		} finally {
			eventoAEliminar = null;
		}
	});

	async function validarDimensionesImagen(file) {
		return new Promise(resolve => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				const ok = img.width >= 150 && img.height >= 150;
				resolve(ok);
			};
			img.onerror = () => resolve(false);
		});
	}
}	