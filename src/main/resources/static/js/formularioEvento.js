// 📁 static/js/formulario.js

export function initFormulario() {
  const form = document.getElementById("formNuevoEvento");

  if (!form) {
    console.error("❌ No se encontró el formulario #formNuevoEvento");
    return;
  }

  console.log("✅ Formulario detectado, configurando listener...");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("🚀 Enviando formulario...");

    const formData = new FormData(form);
    const evento = Object.fromEntries(formData.entries());
    
    // Validar titulo
    if (!evento.titulo.trim()) {
  alert("El título no puede estar vacío");
  return;
}
evento.titulo = evento.titulo.trim();

// Validar descripcion
if (!evento.descripcion.trim()) {
  alert("La descripción no puede estar vacía");
  return;
}
evento.descripcion = evento.descripcion.trim();

//Validar categoria (Mas adelante sera estricta y no aceptará null)
evento.categoriaId = evento.categoriaId ? parseInt(evento.categoriaId) : null;
    
    // === ⏰ Validación de fechas ===
    const inicio = new Date(evento.fechaInicio);
    const fin = new Date(evento.fechaFin);
    const ahora = new Date();

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      errores.push("Debes ingresar fechas válidas de inicio y fin.");
    } else {
      if (inicio < ahora) errores.push("La fecha de inicio no puede ser en el pasado.");
      if (fin <= inicio) errores.push("La fecha de fin debe ser posterior a la fecha de inicio.");
    }
    // Validar dirección
    if (!evento.ubicacion.trim()) errores.push("La dirección es obligatoria.");
    
        // Validar coordenadas
    const lat = parseFloat(evento.latitud);
    const lon = parseFloat(evento.longitud);
    if (isNaN(lat) || isNaN(lon)) errores.push("Debes seleccionar una ubicación en el mapa.");
    
     // === 💰 Precio (opcional) ===
    let precio = evento.precio ? parseFloat(evento.precio) : null;
    if (precio !== null && (isNaN(precio) || precio < 0)) {
      errores.push("El precio debe ser un número válido o quedar vacío si es gratis.");
    }
    
    // === 🖼️ Imagen (opcional) ===
    const imagen = formData.get("imagen");
    if (!imagen || imagen.size === 0) {
      formData.delete("imagen"); // no enviar si no se seleccionó
    }
    
    // Validar URL Externa
    if (!evento.urlVentaExterna) {
  evento.urlVentaExterna = null;
} else {
  try {
    new URL(evento.urlVentaExterna);
  } catch {
    alert("Ingrese una URL válida");
    return;
  }
}

//Validar verificacion edad
evento.requiereVerificarEdad = !!formData.get("requiereVerificarEdad");

    // Si hay errores, mostrar alerta y cancelar envío
    if (errores.length > 0) {
      alert("⚠️ Corrige los siguientes errores antes de continuar:\n\n" + errores.join("\n"));
      return;
    }

    // Convertir tipos numéricos
    evento.latitud = parseFloat(evento.latitud) || 0;
    evento.longitud = parseFloat(evento.longitud) || 0;
    
    // Cuando se agrege el inicio de sesion y el manejo de la PK de organizador, esto se usara. De momento, lo ponemos NULL
    evento.organizador = null;

    // Armar payload
    const data = new FormData();
    data.append("evento", new Blob([JSON.stringify(evento)], { type: "application/json" }));
    if (formData.get("imagen")) {
      data.append("imagen", formData.get("imagen"));
    }

    try {
      const resp = await fetch("http://localhost:8080/api/eventos/guardar", {
        method: "POST",
        body: data,
      });

      if (!resp.ok) throw new Error("Error al guardar el evento");

      const json = await resp.json();
      console.log("✅ Evento guardado correctamente:", json);
      alert("Evento guardado correctamente ✅");

      //Cerramos modal de creacion de evento y actualizamos la pagina o mapa
      const modal = bootstrap.Modal.getInstance(document.getElementById("nuevoEventoModal"));
      if (modal) modal.hide();

      if (window.mapInstance) {
        window.mapInstance.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            window.mapInstance.removeLayer(layer);
          }
        });
        if (window.cargarEventos) window.cargarEventos(window.mapInstance);
      }

    } catch (err) {
      console.error("❌ Error al guardar el evento:", err);
      alert("Error al guardar el evento: " + err.message);
    }
  });
}