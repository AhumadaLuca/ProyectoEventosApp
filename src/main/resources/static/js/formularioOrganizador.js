
import { mostrarToast } from './toastsGenerico.js';
import {actualizarMenuUsuario} from './AuthUI.js';

export function initFormularioOrganizador() {

	const form = document.getElementById("formRegistro");
	if (!form) return;

	const errBox = document.getElementById("registroError");

	// helpers
	function showFieldError(inputId, msg) {
		const input = document.getElementById(inputId);
		const error = document.getElementById("error" + inputId.replace("reg", ""));
		if (!input || !error) return;
		input.classList.add("is-invalid");
		error.textContent = msg;
		error.classList.remove("d-none");
	}

	function clearFieldError(inputId) {
		const input = document.getElementById(inputId);
		const error = document.getElementById("error" + inputId.replace("reg", ""));
		if (!input || !error) return;
		input.classList.remove("is-invalid");
		error.textContent = "";
		error.classList.add("d-none");
	}

	// escuchar inputs una sola vez (no dentro del submit)
	form.addEventListener("input", (e) => {
		if (e && e.target && e.target.id) clearFieldError(e.target.id);
		if (errBox) {
			errBox.classList.add("d-none");
			errBox.innerText = "";
		}
	});

	form.addEventListener("submit", async function(e) {
		e.preventDefault();

		// capturar campos
		const nombre = document.getElementById("regNombre")?.value.trim() || "";
		const apellido = document.getElementById("regApellido")?.value.trim() || "";
		const email = document.getElementById("regEmail")?.value.trim() || "";
		const password = document.getElementById("regPassword")?.value || "";
		const password2 = document.getElementById("regPassword2")?.value || "";
		const fechaNacimiento = document.getElementById("regFechaNacimiento")?.value || "";
		const telefono = document.getElementById("regTelefono")?.value || "";
		const nombreOrganizacion = document.getElementById("regNombreOrganizacion")?.value.trim() || "";
		const direccionOrganizacion = document.getElementById("regDireccionOrganizacion")?.value.trim() || "";
		const imagenInput = document.getElementById("regImagenPerfil");
		const imagen = imagenInput && imagenInput.files && imagenInput.files[0] ? imagenInput.files[0] : null;

		let hasError = false;

		// validaciones
		if (!nombre) { showFieldError("regNombre", "Ingrese su nombre"); hasError = true; }
		if (!apellido) { showFieldError("regApellido", "Ingrese su apellido"); hasError = true; }
		if (!email || !email.includes("@")) { showFieldError("regEmail", "Email inválido"); hasError = true; }
		if (password.length < 6) { showFieldError("regPassword", "La contraseña debe tener mínimo 6 caracteres"); hasError = true; }
		if (password !== password2) { showFieldError("regPassword2", "Las contraseñas no coinciden"); hasError = true; }

		// fechaNacimiento: primero validar que exista y sea una fecha válida
		if (!fechaNacimiento) {
			showFieldError("regFechaNacimiento", "Ingrese fecha de nacimiento");
			hasError = true;
		} else {
			const userDate = new Date(fechaNacimiento);
			if (isNaN(userDate.getTime())) {
				showFieldError("regFechaNacimiento", "Fecha inválida");
				hasError = true;
			} else {
				const adultLimit = new Date();
				adultLimit.setFullYear(adultLimit.getFullYear() - 18);
				if (userDate > adultLimit) {
					showFieldError("regFechaNacimiento", "Debes ser mayor de 18 años para registrarte");
					hasError = true;
				}
			}
		}

		// validación de imagen opcional
		if (imagen) {
			const validExt = ["image/jpeg", "image/png", "image/webp"];
			if (!validExt.includes(imagen.type)) {
				showFieldError("regImagenPerfil", "Formato de imagen inválido. Usa JPG, PNG o WEBP");
				hasError = true;
			}
			if (imagen.size > 2 * 1024 * 1024) {
				showFieldError("regImagenPerfil", "La imagen no debe superar los 2MB");
				hasError = true;
			}
			// validarDimensionesImagen debe existir y devolver boolean
			if (typeof validarDimensionesImagen === "function") {
				const ok = await validarDimensionesImagen(imagen);
				if (!ok) { showFieldError("regImagenPerfil", "La imagen debe ser mínimo 150x150 pixeles"); hasError = true; }
			}
		}

		if (hasError) return;

		// armar payload (no incluir telefono si no existe en HTML)
		const organizador = {
			nombre,
			apellido,
			email,
			password,
			fechaNacimiento,
			nombreOrganizacion,
			direccionOrganizacion,
			telefono
		};

		const formData = new FormData();
		formData.append("organizador", new Blob([JSON.stringify(organizador)], { type: "application/json" }));
		if (imagen) formData.append("fotoPerfil", imagen); // solo si existe

		// envío
		try {
			const res = await fetch("http://localhost:8080/api/auth/registro", {
				method: "POST",
				body: formData
			});

			if (!res.ok) {
				const msg = await res.text().catch(() => null);
				mostrarToast("Error al registrar:" + msg, "danger");
				return;
			}

			// Reseteamos formulario, cerramos modal y avisamos registro exitoso
			form.reset();
			bootstrap.Modal.getInstance(document.getElementById("registroModal")).hide();
			mostrarToast("Registro exitoso 🎉", "success");

		} catch (error) {
			console.error("Error en fetch registro:", error);
			mostrarToast("Error de conexión con el servidor", "danger");
		}
	});

	document.getElementById("formLogin").addEventListener("submit", async function(e) {
		e.preventDefault();

		const email = document.getElementById("loginEmail").value.trim();
		const password = document.getElementById("loginPassword").value.trim();
		const err = document.getElementById("loginError");

		// Reset errores
		err.classList.add("d-none");
		err.innerText = "";

		// Validaciones básicas
		if (!email || !password) {
			err.innerText = "Completa todos los campos";
			err.classList.remove("d-none");
			return;
		}

		try {
			const resp = await fetch("http://localhost:8080/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			if (!resp.ok) {
				mostrarToast("Credenciales incorrectas", "danger");
				return;
			}

			const data = await resp.json();

			// ⬇Guardamos lo que devuelve el backend
			localStorage.setItem("id", data.id);
			localStorage.setItem("token", data.token);
			localStorage.setItem("nombre", data.nombre);
			localStorage.setItem("rol", data.rol);

			// Cerrar modal
			bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();

			// Avisamos Login y actualizamos UI
			mostrarToast("¡Bienvenido, " + data.nombre + "!", "success");
			actualizarMenuUsuario();

		} catch (error) {
			console.error("Error en login:", error);
			mostrarToast("Error al iniciar sesión. Intenta más tarde.", "danger");
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