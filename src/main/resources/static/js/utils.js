// utils.js
export function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}