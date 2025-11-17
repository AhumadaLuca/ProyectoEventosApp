export function mostrarToast(mensaje, tipo) {
  const toastContainer = document.getElementById("toastContainer");

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${tipo} border-0 show`;
  toastEl.role = "alert";
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensaje}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  const bsToast = new bootstrap.Toast(toastEl, { delay: 6000 });
  bsToast.show();

  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}