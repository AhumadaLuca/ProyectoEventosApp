export function initPasswordToggles() {
	
	document.addEventListener("click", (e) => {
    if (e.target.matches("[data-toggle-password], [data-toggle-password] *")) {

        const button = e.target.closest("[data-toggle-password]");
        const input = button.parentElement.querySelector("[data-password]");
        const icon = button.querySelector("[data-icon]");

        if (!input) return;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");
        } else {
            input.type = "password";
            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");
        }
    }
});
	
}