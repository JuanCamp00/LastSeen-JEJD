// Pantalla 03: panel principal (datos de demostración hasta integrar el backend).
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();

    // Se requiere haber pasado antes por el formulario del login.
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }

    document.getElementById('nombre-perfil').textContent = nombre;

    document.getElementById('cerrar-sesion').addEventListener('click', () => {
        sessionStorage.removeItem('lastSeen.nombreInvestigador');
        window.location.replace('./index.html');
    });
});
