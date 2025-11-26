export function mostrarModalConfirmacion({
    titulo = "Confirmar acción",
    mensaje = "¿Estás seguro?",
    tipo = "primary", // primary | danger | warning | success
    textoBoton = "Aceptar",
    onConfirm = () => {}
}) {
    const modalEl = document.getElementById("modalConfirmacion");
    const modal = new bootstrap.Modal(modalEl);

    // Elementos del modal
    const header = document.getElementById("modalConfirmacionHeader");
    const titleEl = document.getElementById("modalConfirmacionLabel");
    const msgEl = document.getElementById("modalConfirmacionMensaje");
    const btnConfirm = document.getElementById("modalConfirmacionBtn");

    // Aplicar contenido
    titleEl.textContent = titulo;
    msgEl.textContent = mensaje;

    // Estilo del header según tipo
    header.className = "modal-header text-white bg-" + tipo;

    // Texto del botón
    btnConfirm.textContent = textoBoton;
    btnConfirm.className = "btn btn-" + tipo;

    // Quitar listeners anteriores
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);

    // Agregar callback
    newBtn.addEventListener("click", () => {
        onConfirm();
        modal.hide();
    });

    // Mostrar modal
    modal.show();
}