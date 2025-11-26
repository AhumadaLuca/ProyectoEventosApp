import { mostrarToast } from './toastsGenerico.js';
import { abrirModalDetalle } from "./modalDetallesGenerico.js";

export function initVerOrganizador() {
	const linkPerfil = document.getElementById("linkPerfil");

	if (!linkPerfil) {
		console.warn("⛔ linkPerfil no existe (usuario no logeado)");
		return;
	}

	linkPerfil.addEventListener("click", verPerfilOrganizador);
}

async function verPerfilOrganizador(e){	
	
    e.preventDefault();

    const orgId = localStorage.getItem("id"); // ← el ID del usuario logueado
    if (!orgId) {
        mostrarToast("No se pudo obtener tu ID. Inicia sesión nuevamente.", "danger");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/organizadores/ver/${orgId}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}` 
            }
        });

        if (!response.ok){
			mostrarToast("No se pudo obtener el perfil.", "danger");
		}

        const org = await response.json();
	console.log(org);
        abrirModalDetalle({
            titulo: "Mi Perfil",
            cuerpoHTML: `
                <div class="text-center">
                    <img src="${org.fotoPerfil}" 
                         class="img-fluid rounded-circle mb-3" 
                         style="width: 120px; height: 120px; object-fit: cover;">

                    <h4>${org.nombre} ${org.apellido}</h4>
                    <p><b>Email:</b> ${org.email}</p>
                    <p><b>Teléfono:</b> ${org.telefono}</p>
                    <p><b>Fecha de nacimiento:</b> ${org.fechaNacimiento}</p>
                    <p><b>Organización:</b> ${org.nombreOrganizacion || "-"}</p>
                    <p><b>Dirección:</b> ${org.direccionOrganizacion || "-"}</p>
                    <p><b>Rol:</b> ${org.rol}</p>
                    <p><b>Registrado el:</b> ${org.fechaRegistro}</p>
                    <p><b>Verificado:</b> ${org.verificado ? "✅ Sí" : "❌ No"}</p>
                </div>
            `,
            botonesHTML: `
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Cerrar
                </button>
            `
        });


    } catch (err) {
        console.error("Error al ver perfil:", err);
        mostrarToast("Error al cargar tu perfil.", "danger");
    }

}
