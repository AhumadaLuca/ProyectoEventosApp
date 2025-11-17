export function actualizarMenuUsuario() {
	
    const token = localStorage.getItem("token");
    const nombre = localStorage.getItem("nombre");
    const rol = localStorage.getItem("rol");

    const menu = document.getElementById("usuarioMenu");

    menu.innerHTML = ""; // limpiamos el menu

    if (!token) {
        // Usuario NO logueado
        menu.innerHTML = `
            <a href="#" id="linkLogin" data-bs-toggle="modal" data-bs-target="#loginModal">Iniciar Sesión</a>
            <a href="#" id="linkRegistro" data-bs-toggle="modal" data-bs-target="#registroModal">Registrarse</a>
        `;
        return;
    }

    // Usuario logueado
    menu.innerHTML = `
        <span class="text-white fw-semibold d-block mb-2 mt-2">👋 Hola, ${nombre}</span>
        <a href="#" id="linkPerfil">Mi Perfil</a>
        ${rol === "ADMIN" ? `<a href="#" id="linkAdminPanel" data-bs-toggle="modal" data-bs-target="#adminPanelModal">⚙️ Panel Admin</a>` : ""}
        ${rol === "ORGANIZADOR" ? `<a href="#" id="linkEventosOrganizador" data-bs-toggle="modal" data-bs-target="#modalAdministrarEventosOrganizador">🎉 Mis Eventos</a>` : ""}
        ${rol === "ORGANIZADOR" ? `<a href="#" id="linkNuevoEvento" data-bs-toggle="modal" data-bs-target="#nuevoEventoModal">📝 Agregar Evento</a>` : ""}
        <a href="#" id="btnLogout">❌ Cerrar sesión</a>
    `;

    // Acción logout
    document.getElementById("btnLogout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("nombre");
        actualizarMenuUsuario(); 
    });
}