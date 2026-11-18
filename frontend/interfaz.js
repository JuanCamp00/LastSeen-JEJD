/* LAST SEEN · Login conectado con la API de usuarios. */
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';

    const formulario = document.getElementById('formulario-login');
    const campoNombre = document.getElementById('nombre-investigador');
    const mensajeError = document.getElementById('mensaje-error');
    const contenedorCampo = document.querySelector('.campo-investigador');
    const botonEnviar = formulario.querySelector('button[type="submit"]');
    const textoBoton = botonEnviar.querySelector('span');
    const textoOriginalBoton = textoBoton?.textContent || 'ABRIR EXPEDIENTE';

    const mensajeConfirmacion = document.createElement('p');
    mensajeConfirmacion.className = 'mensaje-confirmacion';
    mensajeConfirmacion.setAttribute('role', 'status');
    mensajeConfirmacion.setAttribute('aria-live', 'polite');
    formulario.insertAdjacentElement('afterend', mensajeConfirmacion);

    campoNombre.addEventListener('input', () => {
        mensajeError.hidden = true;
        contenedorCampo.classList.remove('error');
        campoNombre.removeAttribute('aria-invalid');
        mensajeConfirmacion.textContent = '';
        mensajeConfirmacion.classList.remove('error');
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nombre = campoNombre.value.trim();

        if (!nombre) {
            mensajeError.textContent = 'Debes introducir un nombre para continuar.';
            mensajeError.hidden = false;
            contenedorCampo.classList.add('error');
            campoNombre.setAttribute('aria-invalid', 'true');
            campoNombre.focus();
            return;
        }

        if (nombre.length > 40) {
            mensajeError.textContent = 'El nombre no puede superar los 40 caracteres.';
            mensajeError.hidden = false;
            contenedorCampo.classList.add('error');
            campoNombre.setAttribute('aria-invalid', 'true');
            campoNombre.focus();
            return;
        }

        mensajeError.hidden = true;
        contenedorCampo.classList.remove('error');
        campoNombre.removeAttribute('aria-invalid');
        mensajeConfirmacion.classList.remove('error');
        mensajeConfirmacion.textContent = 'Conectando con el servidor y registrando al investigador...';
        botonEnviar.disabled = true;
        if (textoBoton) textoBoton.textContent = 'CONECTANDO...';
        formulario.setAttribute('aria-busy', 'true');

        // Evitar reutilizar un ID anterior si se intenta entrar con otro nombre.
        sessionStorage.removeItem('lastSeen.idUsuario');
        sessionStorage.removeItem('lastSeen.nombreInvestigador');
        sessionStorage.removeItem('lastSeen.idPartida');
        sessionStorage.removeItem('lastSeen.ordenResuelto');

        try {
            const respuesta = await fetch(`${API_BASE_URL}/usuarios/identificar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombreUsuario: nombre })
            });

            const datos = await respuesta.json().catch(() => null);

            if (!respuesta.ok) {
                throw new Error(
                    datos?.mensaje || `No se pudo registrar al investigador (HTTP ${respuesta.status}).`
                );
            }

            const usuario = datos?.usuario;
            const idUsuario = Number(usuario?.id_usuario);
            const nombreRegistrado = usuario?.nombre_usuario;

            if (!Number.isSafeInteger(idUsuario) || idUsuario <= 0 || typeof nombreRegistrado !== 'string') {
                throw new Error('La API respondió, pero no devolvió los datos válidos del investigador.');
            }

            // Estos datos quedan disponibles durante la sesión del navegador.
            // El registro permanente del usuario ya está guardado en PostgreSQL.
            sessionStorage.setItem('lastSeen.nombreInvestigador', nombreRegistrado);
            sessionStorage.setItem('lastSeen.idUsuario', String(idUsuario));

            mensajeConfirmacion.textContent = 'Investigador identificado correctamente. Abriendo expediente...';
            window.location.href = './introduccion.html';
        } catch (error) {
            const mensaje = error instanceof TypeError
                ? 'No se pudo conectar con el servidor. Comprueba que el backend esté activo y que estés usando Live Server.'
                : error.message;

            mensajeConfirmacion.textContent = mensaje;
            mensajeConfirmacion.classList.add('error');
        } finally {
            botonEnviar.disabled = false;
            if (textoBoton) textoBoton.textContent = textoOriginalBoton;
            formulario.removeAttribute('aria-busy');
        }
    });
});
