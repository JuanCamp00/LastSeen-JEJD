/* LAST SEEN · EXPEDIENTE 002: LAS SEÑALES IGNORADAS
   Demostración de interfaz y progreso SOLO en sessionStorage.
   La validación definitiva corresponde al backend de tu compañero.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const clave01 = `lastSeen.demo.expediente001.v2.${encodeURIComponent(nombre)}.resuelto`;
    if (sessionStorage.getItem(clave01) !== 'true') {
        window.location.replace('./investigacion.html');
        return;
    }

    const base = `lastSeen.demo.expediente002.v1.${encodeURIComponent(nombre)}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const clave03Resuelto = `lastSeen.demo.expediente003.v1.${encodeURIComponent(nombre)}.resuelto`;
    const clave04Resuelto = `lastSeen.demo.expediente004.v1.${encodeURIComponent(nombre)}.resuelto`;
    const clave05Resuelto = `lastSeen.demo.expediente005.v1.${encodeURIComponent(nombre)}.resuelto`;
    const clave06Resuelto = `lastSeen.demo.expediente006.v1.${encodeURIComponent(nombre)}.resuelto`;
    const clave07Resuelto = `lastSeen.demo.expediente007.v1.${encodeURIComponent(nombre)}.resuelto`;
    const lectura = document.getElementById('dialogo-entrevista');
    const acertijo = document.getElementById('dialogo-acertijo02');
    const botonAcertijo = document.getElementById('abrir-acertijo02');
    const requisito = document.getElementById('acertijo02-requisito');
    const formulario = document.getElementById('form-acertijo02');
    const respuesta = document.getElementById('respuesta02');
    const estado = document.getElementById('respuesta-acertijo02-estado');
    const comprobar = document.getElementById('comprobar-acertijo02');
    const estadoAnalisis = document.getElementById('estado-analisis02');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentos = 0;

    document.getElementById('investigador-activo').textContent = nombre;

    const normalizar = texto => texto.toLocaleLowerCase('es')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ').trim();

    function esCorrecta(texto) {
        const v = normalizar(texto);
        // Variantes equivalentes de la respuesta oficial en datos_iniciales.sql.
        if (v === 'que una persona tuviera la ultima palabra') return true;
        const unResponsable = /\b(una persona|una sola persona|alguien|una sola voz|un responsable)\b/.test(v);
        const decisionDefinitiva = /\b(ultima palabra|decision final|decision definitiva|decisiones finales|decisiones definitivas)\b/.test(v);
        const tomarDecisiones = /\b(tome|tomara|tomase|tuviera|tenga|debia tomar|debe tomar|tiene que tomar) las? decisiones?\b/.test(v);
        return unResponsable && (decisionDefinitiva || tomarDecisiones);
    }

    function refrescar() {
        document.getElementById('objetivo-entrevista').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo02').classList.toggle('objetivo-completado', resuelto);
        botonAcertijo.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 02 resuelto en esta demostración. El resultado no se ha enviado al backend.'
            : examinado
                ? 'Transcripción examinada. Ya puedes escribir tu conclusión.'
                : 'Examina la entrevista recuperada antes de responder.';
        if (resuelto) {
            botonAcertijo.textContent = 'REVISAR RESPUESTA 02 →';
            estadoAnalisis.textContent = '●  ACERTIJO 02 RESUELTO';
        } else if (examinado) {
            estadoAnalisis.textContent = '●  TRANSCRIPCIÓN EXAMINADA';
        }
        const cantidad = sessionStorage.getItem(clave07Resuelto) === 'true' ? 7 : sessionStorage.getItem(clave06Resuelto) === 'true' ? 6 : sessionStorage.getItem(clave05Resuelto) === 'true' ? 5 : sessionStorage.getItem(clave04Resuelto) === 'true' ? 4 : sessionStorage.getItem(clave03Resuelto) === 'true' ? 3 : resuelto ? 2 : 1;
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => { p.value = cantidad; });
        document.querySelector('.avance-general-fila strong').textContent = `${cantidad} / 7`;
        document.querySelector('.contador-progreso').textContent = `${cantidad} / 7 ACERTIJOS`;
        const confianza = document.querySelector('.confianza-panel progress');
        if (confianza) confianza.value = cantidad;
        const estadoConfianza = document.querySelector('.confianza-panel > p');
        if (estadoConfianza) estadoConfianza.textContent = resuelto
            ? 'CONFIANZA EN DESARROLLO (DEMO)'
            : 'PRIMER ACERCAMIENTO (DEMO)';
    }

    function leerEntrevista() {
        if (!examinado) {
            examinado = true;
            sessionStorage.setItem(claveLectura, 'true');
            refrescar();
        }
        lectura.showModal();
    }

    document.getElementById('abrir-entrevista').addEventListener('click', leerEntrevista);
    document.getElementById('ver-entrevista').addEventListener('click', leerEntrevista);
    document.getElementById('cerrar-entrevista').addEventListener('click', () => lectura.close());
    lectura.addEventListener('click', e => { if (e.target === lectura) lectura.close(); });

    botonAcertijo.addEventListener('click', () => {
        if (botonAcertijo.disabled) return;
        if (resuelto) {
            respuesta.value = 'Que una persona tuviera la última palabra.';
            respuesta.readOnly = true;
            comprobar.disabled = true;
            estado.textContent = 'Correcto. El desarrollador backend consideraba necesario que una persona tuviera la última palabra.';
        }
        acertijo.showModal();
        if (!resuelto) respuesta.focus();
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();
        if (resuelto) return;
        const texto = respuesta.value.trim();
        if (!texto) {
            estado.textContent = 'Escribe tu conclusión antes de comprobarla.';
            respuesta.focus();
            return;
        }
        intentos++;
        if (!esCorrecta(texto)) {
            estado.textContent = `Intento ${intentos}: revisa qué dijo el desarrollador sobre quién debía decidir.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        respuesta.value = 'Que una persona tuviera la última palabra.';
        respuesta.readOnly = true;
        comprobar.disabled = true;
        estado.textContent = '¡Correcto! Una persona debía tener la última palabra. Has completado el Acertijo 02.';
        refrescar();
    });

    document.getElementById('cerrar-acertijo02').addEventListener('click', () => acertijo.close());
    acertijo.addEventListener('click', e => { if (e.target === acertijo) acertijo.close(); });
    respuesta.addEventListener('input', () => { if (!resuelto) estado.textContent = ''; });
    refrescar();
});
