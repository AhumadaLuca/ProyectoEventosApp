import { filtrarEventos, eventosCache, dibujarEventosEnMapa } from "./eventos.js";


document.getElementById("btnAplicarFiltros").addEventListener("click", () => {

    const categorias = [...document.querySelectorAll(".filtro-categoria:checked")]
        .map(c => c.value);

    const precioMax = document.getElementById("filtroPrecio").value;
    const fechaDesde = document.getElementById("filtroFechaDesde").value;
    const fechaHasta = document.getElementById("filtroFechaHasta").value;
    
    // Convertimos todo a un objeto único
    const filtros = {
        categorias: categorias,
        precioMax: precioMax ? Number(precioMax) : null,
        fechaDesde: fechaDesde || null,
        fechaHasta: fechaHasta || null
    };

    filtrarEventos(filtros);
    
    // Mostrar botón de quitar filtros si hay filtros activos
    const btnQuitar = document.getElementById("btnQuitarFiltros");
    if (hayFiltrosActivos(filtros)) {
        btnQuitar.classList.remove("d-none");
    }

    bootstrap.Modal.getInstance(document.getElementById("filtrosModal")).hide();
});

function hayFiltrosActivos(filtros) {
    return (
        (filtros.categorias.length > 0) ||
        (filtros.precioMax !== null) ||
        (filtros.fechaDesde !== null) ||
        (filtros.fechaHasta !== null)
    );
}

document.getElementById("btnQuitarFiltros").addEventListener("click", () => {
    
    // 1. Ocultar botón nuevamente
    document.getElementById("btnQuitarFiltros").classList.add("d-none");

    // 2. Limpiar los campos del formulario
    document.querySelectorAll(".filtro-categoria").forEach(c => c.checked = false);
    document.getElementById("filtroPrecio").value = "";
    document.getElementById("filtroFechaDesde").value = "";
    document.getElementById("filtroFechaHasta").value = "";

    // 3. Restaurar todos los eventos desde eventosCache
    if (window.eventMarkersLayer) {
        window.eventMarkersLayer.clearLayers();
    }

    dibujarEventosEnMapa(eventosCache);

});