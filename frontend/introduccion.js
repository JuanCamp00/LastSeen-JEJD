/* LAST SEEN · Introducción al caso. Prototipo local: nombre en sessionStorage. */
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    document.getElementById('nombre-investigador').textContent = nombre;
});
