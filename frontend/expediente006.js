/* LAST SEEN · EXPEDIENTE 006 / DETRÁS DEL PROYECTO
   Prototipo frontend: datos provisionales en sessionStorage.
   No realiza peticiones al backend ni a PostgreSQL.
   Enunciado y respuesta oficial: datos_iniciales.sql (orden 6).
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const id = encodeURIComponent(nombre);
    const clave05 = `lastSeen.demo.expediente005.v1.${id}.resuelto`;
    if (sessionStorage.getItem(clave05) !== 'true') {
        window.location.replace('./expediente005.html');
        return;
    }
    const base = `lastSeen.demo.expediente006.v1.${id}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const clave07Resuelto = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
    const visor = document.getElementById('dialogo-registro06');
    const dialogoAcertijo = document.getElementById('dialogo-acertijo06');
    const botonResolver = document.getElementById('abrir-acertijo06');
    const requisito = document.getElementById('acertijo06-requisito');
    const formulario = document.getElementById('form-acertijo06');
    const respuesta = document.getElementById('respuesta06');
    const estado = document.getElementById('respuesta-acertijo06-estado');
    const comprobar = document.getElementById('comprobar-acertijo06');
    const estadoAnalisis = document.getElementById('estado-analisis06');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    // Intentos locales independientes para cada investigador y expediente.
    const claveIntentos = `lastSeen.demo.intentos.expediente006.${encodeURIComponent(nombre)}`;
    const contadorGuardado = Number(localStorage.getItem(claveIntentos));
    let intentos = Number.isSafeInteger(contadorGuardado) && contadorGuardado >= 0 ? contadorGuardado : 0;

    document.getElementById('investigador-activo').textContent = nombre;

    const normalizar = texto => texto.toLocaleLowerCase('es')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    function respuestaCorrecta(texto) {
        const valor = normalizar(texto);
        // Respuesta SQL: «Sus desacuerdos constantes sobre las decisiones técnicas del proyecto.»
        // Permite paráfrasis que mencionen tanto el conflicto como las decisiones técnicas.
        const conflicto = /\b(desacuerdos?|discusiones?|conflictos?|diferencias?|disputas?|peleas?)\b/.test(valor)
            || /no (?:se )?ponian de acuerdo/.test(valor);
        const tecnico = /\b(tecnic[ao]s?|arquitectura|estructura|codigo|sistema|integracion|implementacion)\b/.test(valor);
        const decisionesEnProyecto = /\b(decisiones?|cambios?|modificaciones?|ajustes?)\b/.test(valor)
            && /\b(proyecto|desarrollo|software|programacion)\b/.test(valor);
        return conflicto && (tecnico || decisionesEnProyecto);
    }

    function mostrarResuelto() {
        respuesta.value = 'Sus desacuerdos constantes sobre las decisiones técnicas del proyecto.';
        respuesta.readOnly = true;
        comprobar.disabled = true;
        estado.textContent = 'Correcto: sus desacuerdos sobre las decisiones técnicas afectaban la colaboración.';
    }

    function actualizar() {
        document.getElementById('objetivo-registro06').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo06').classList.toggle('objetivo-completado', resuelto);
        botonResolver.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 06 resuelto. El resultado se ha guardado solo para esta sesión.'
            : examinado ? 'Documento examinado. Ya puedes responder.'
                : 'Examina el registro de conflictos antes de responder.';
        estadoAnalisis.textContent = resuelto
            ? '●  ACERTIJO 06 RESUELTO'
            : examinado ? '●  REGISTRO EXAMINADO' : '●  ANÁLISIS PENDIENTE';
        botonResolver.textContent = resuelto ? 'REVISAR RESPUESTA 06 →' : 'RESOLVER ACERTIJO 06 →';
        const cantidad = sessionStorage.getItem(clave07Resuelto) === 'true' ? 7 : resuelto ? 6 : 5;
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => { p.value = cantidad; });
        document.querySelector('.avance-general-fila strong').textContent = `${cantidad} / 7`;
        document.querySelector('.contador-progreso').textContent = `${cantidad} / 7 ACERTIJOS`;
        document.querySelector('.confianza-panel progress').value = cantidad;
    }

    function abrirDocumento() {
        if (!examinado) {
            examinado = true;
            sessionStorage.setItem(claveLectura, 'true');
            actualizar();
        }
        visor.showModal();
    }
    document.getElementById('ver-registro06').addEventListener('click', abrirDocumento);
    document.getElementById('abrir-registro06').addEventListener('click', abrirDocumento);
    document.getElementById('cerrar-registro06').addEventListener('click', () => visor.close());
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
        localStorage.setItem(claveIntentos, String(intentos));
        if (!respuestaCorrecta(texto)) {
            estado.textContent = `Intento ${intentos}: compara las posturas técnicas de ambos desarrolladores.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mostrarResuelto();
        estado.textContent = '¡Correcto! Has completado el Acertijo 06. Progreso: 6 / 7.';
        actualizar();
    });
    respuesta.addEventListener('input', () => { if (!resuelto) estado.textContent = ''; });
    document.getElementById('cerrar-acertijo06').addEventListener('click', () => dialogoAcertijo.close());
    dialogoAcertijo.addEventListener('click', e => { if (e.target === dialogoAcertijo) dialogoAcertijo.close(); });

    if (resuelto) mostrarResuelto();
    actualizar();
});
