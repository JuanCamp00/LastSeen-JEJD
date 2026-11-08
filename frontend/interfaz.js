
document.addEventListener('DOMContentLoaded', () => {

    // Obtener elementos del formulario
    const formulario = document.getElementById('formulario-login');
    const campoNombre = document.getElementById('nombre-investigador');
    const mensajeError = document.getElementById('mensaje-error');
    const contenedorCampo = document.querySelector('.campo-investigador');

    // Crear un mensaje temporal de confirmación
    const mensajeConfirmacion = document.createElement('p');
    mensajeConfirmacion.className = 'mensaje-confirmacion';
    mensajeConfirmacion.setAttribute('role', 'status');
    formulario.insertAdjacentElement('afterend', mensajeConfirmacion);

    // Eliminar errores cuando el usuario escriba
    campoNombre.addEventListener('input', () => {
        mensajeError.hidden = true;
        contenedorCampo.classList.remove('error');
        campoNombre.removeAttribute('aria-invalid');
        mensajeConfirmacion.textContent = '';
    });

    // Validar el formulario al presionar el botón
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombre = campoNombre.value.trim();

        // Comprobar que el nombre no esté vacío
        if (nombre === '') {
            mensajeError.textContent =
                'Debes introducir un nombre para continuar.';

            mensajeError.hidden = false;
            contenedorCampo.classList.add('error');
            campoNombre.setAttribute('aria-invalid', 'true');
            campoNombre.focus();

            return;
        }

        // Guardar temporalmente el nombre
        sessionStorage.setItem(
            'lastSeen.nombreInvestigador',
            nombre
        );

        mensajeError.hidden = true;
        contenedorCampo.classList.remove('error');
        campoNombre.removeAttribute('aria-invalid');

        // Abrir la pantalla de introducción
        window.location.href = './introduccion.html';   
    });

});
