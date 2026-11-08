
document.addEventListener('DOMContentLoaded', () => {

    // Recuperar el nombre del investigador
    const nombre = sessionStorage.getItem(
        'lastSeen.nombreInvestigador'
    );

    // Verificar que exista un investigador
    if (!nombre || nombre.trim() === '') {
        window.location.replace('./index.html');
        return;
    }

    // Mostrar el nombre del investigador
    const elementoNombre = document.getElementById(
        'nombre-investigador'
    );

    elementoNombre.textContent = nombre;

    // Obtener el botón ABRIR CASO
    const botonAbrirCaso = document.getElementById(
        'boton-abrir-caso'
    );

    // Navegar hacia el panel principal
    botonAbrirCaso.addEventListener('click', () => {
        window.location.href = './inicio.html';
    });

});
