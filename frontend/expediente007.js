/* LAST SEEN · EXPEDIENTE 007 / LA ÚLTIMA PIEZA
   Prototipo del frontend: sin backend ni conexión a PostgreSQL.
   Pregunta/respuesta canónicas: datos_iniciales.sql (orden 7).
   Documento íntegro: documentos.zip/expediente_007/ultimo_registro_recuperado.txt
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const id = encodeURIComponent(nombre);
    const clave06 = `lastSeen.demo.expediente006.v1.${id}.resuelto`;
    if (sessionStorage.getItem(clave06) !== 'true') {
        window.location.replace('./expediente006.html');
        return;
    }
    const base = `lastSeen.demo.expediente007.v1.${id}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const visor = document.getElementById('dialogo-registro07');
    const dialogoAcertijo = document.getElementById('dialogo-acertijo07');
    const botonResolver = document.getElementById('abrir-acertijo07');
    const requisito = document.getElementById('acertijo07-requisito');
    const formulario = document.getElementById('form-acertijo07');
    const respuesta = document.getElementById('respuesta07');
    const estado = document.getElementById('respuesta-acertijo07-estado');
    const comprobar = document.getElementById('comprobar-acertijo07');
    const estadoAnalisis = document.getElementById('estado-analisis07');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentos = 0;

    document.getElementById('investigador-activo').textContent = nombre;

    function normalizar(texto) {
        return texto.toLocaleLowerCase('es')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function respuestaCorrecta(texto) {
        const valor = normalizar(texto);
        // La conclusión debe limitarse a la falta de actividad verificable,
        // sin afirmar que se conoce el destino o la causa de la desaparición.
        const ausencia = /\b(no|sin|ninguna?|ausencia|inactividad|dejo|desaparecio|ceso)\b/.test(valor);
        const actividad = /\b(actividad|movimientos?|conexiones?|registros?)\b/.test(valor);
        const posterior = /\b(posterior(?:es)?|despues|luego|siguiente|mas|volvio|nuev[ao]s?)\b/.test(valor);
        const verificable = /\b(verificabl(?:e|es)|confirmad[ao]s?|registrad[ao]s?|encontrad[ao]s?)\b/.test(valor);
        const otraCuenta = /(?:\bfrontend\b|cuenta del frontend|desarrollador frontend)/.test(valor);
        const cuentaBackend = /\bbackend\b|\bsu cuenta\b|cuenta del desarrollador/.test(valor);
        if (otraCuenta && !cuentaBackend) return false;
        return ausencia && actividad && (posterior || verificable);
    }

    function mostrarResuelto() {
        respuesta.value = 'No se registró actividad verificable posterior de su cuenta.';
        respuesta.readOnly = true;
        comprobar.disabled = true;
        estado.textContent = 'Correcto: no consta actividad verificable posterior de la cuenta del backend.';
    }

    function actualizar() {
        document.getElementById('objetivo-registro07').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo07').classList.toggle('objetivo-completado', resuelto);
        botonResolver.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 07 resuelto. Has examinado los siete expedientes.'
            : examinado ? 'Documento examinado. Ya puedes escribir tu conclusión.'
                : 'Examina el último registro recuperado antes de responder.';
        estadoAnalisis.textContent = resuelto
            ? '●  ACERTIJO 07 RESUELTO' : examinado ? '●  REGISTRO EXAMINADO' : '●  ANÁLISIS PENDIENTE';
        botonResolver.textContent = resuelto ? 'REVISAR RESPUESTA 07 →' : 'RESOLVER ACERTIJO 07 →';
        const cantidad = resuelto ? 7 : 6;
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => { p.value = cantidad; });
        document.querySelector('.avance-general-fila strong').textContent = `${cantidad} / 7`;
        document.querySelector('.contador-progreso').textContent = `${cantidad} / 7 ACERTIJOS`;
        document.querySelector('.confianza-panel progress').value = cantidad;
        document.getElementById('cierre-expediente07').hidden = !resuelto;
        document.getElementById('estado-indice07').textContent = resuelto
            ? '▣  TODOS LOS EXPEDIENTES COMPLETADOS' : '▧  007 / EN INVESTIGACIÓN';
    }

    function abrirDocumento() {
        if (!examinado) {
            examinado = true;
            sessionStorage.setItem(claveLectura, 'true');
            actualizar();
        }
        visor.showModal();
    }
    document.getElementById('ver-registro07').addEventListener('click', abrirDocumento);
    document.getElementById('abrir-registro07').addEventListener('click', abrirDocumento);
    document.getElementById('cerrar-registro07').addEventListener('click', () => visor.close());
    visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });

    botonResolver.addEventListener('click', () => {
        if (botonResolver.disabled) return;
        if (resuelto) mostrarResuelto();
        dialogoAcertijo.showModal();
        if (!resuelto) respuesta.focus();
    });
    formulario.addEventListener('submit', e => {
        e.preventDefault();
        if (resuelto || !examinado) return;
        const texto = respuesta.value.trim();
        if (!texto) {
            estado.textContent = 'Escribe tu conclusión antes de comprobarla.';
            respuesta.focus();
            return;
        }
        intentos++;
        if (!respuestaCorrecta(texto)) {
            estado.textContent = `Intento ${intentos}: compara la actividad posterior de ambas cuentas. No saques conclusiones que los registros no permiten demostrar.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mostrarResuelto();
        estado.textContent = '¡Correcto! Has completado los siete acertijos. Progreso: 7 / 7.';
        actualizar();
    });
    respuesta.addEventListener('input', () => { if (!resuelto) estado.textContent = ''; });
    document.getElementById('cerrar-acertijo07').addEventListener('click', () => dialogoAcertijo.close());
    dialogoAcertijo.addEventListener('click', e => { if (e.target === dialogoAcertijo) dialogoAcertijo.close(); });

    if (resuelto) mostrarResuelto();
    actualizar();
});
