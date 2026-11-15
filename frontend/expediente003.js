/* LAST SEEN · EXPEDIENTE 003 / UN PASADO OLVIDADO
   Esta versión SOLO simula el progreso en sessionStorage.
   La validación definitiva de opciones será responsabilidad del backend.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const id = encodeURIComponent(nombre);
    const clave02 = `lastSeen.demo.expediente002.v1.${id}.resuelto`;
    if (sessionStorage.getItem(clave02) !== 'true') {
        window.location.replace('./expediente002.html');
        return;
    }

    const base = `lastSeen.demo.expediente003.v1.${id}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const clave04Resuelto = `lastSeen.demo.expediente004.v1.${id}.resuelto`;
    const clave05Resuelto = `lastSeen.demo.expediente005.v1.${id}.resuelto`;
    const clave06Resuelto = `lastSeen.demo.expediente006.v1.${id}.resuelto`;
    const clave07Resuelto = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
    const visor = document.getElementById('dialogo-registro03');
    const dialogoAcertijo = document.getElementById('dialogo-acertijo03');
    const botonResolver = document.getElementById('abrir-acertijo03');
    const requisito = document.getElementById('acertijo03-requisito');
    const formulario = document.getElementById('form-acertijo03');
    const estado = document.getElementById('respuesta-acertijo03-estado');
    const comprobar = document.getElementById('comprobar-acertijo03');
    const radios = [...document.querySelectorAll('input[name="respuesta03"]')];
    const estadoAnalisis = document.getElementById('estado-analisis03');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentos = 0;

    document.getElementById('investigador-activo').textContent = nombre;

    function mostrarRespuestaResuelta() {
        const correcta = radios.find(radio => radio.value === '2');
        if (correcta) correcta.checked = true;
        radios.forEach(radio => { radio.disabled = true; });
        comprobar.disabled = true;
        estado.textContent = 'Correcto: diferencias internas sobre la dirección del proyecto.';
    }

    function actualizar() {
        document.getElementById('objetivo-registro03').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo03').classList.toggle('objetivo-completado', resuelto);
        botonResolver.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 03 resuelto. El resultado está guardado solo en este navegador.'
            : examinado
                ? 'Registro examinado. Ya puedes responder.'
                : 'Examina el registro del proyecto anterior antes de responder.';
        estadoAnalisis.textContent = resuelto
            ? '●  ACERTIJO 03 RESUELTO'
            : examinado ? '●  REGISTRO EXAMINADO' : '●  ANÁLISIS PENDIENTE';
        botonResolver.textContent = resuelto ? 'REVISAR RESPUESTA 03 →' : 'RESOLVER ACERTIJO 03 →';
        const cantidad = sessionStorage.getItem(clave07Resuelto) === 'true' ? 7 : sessionStorage.getItem(clave06Resuelto) === 'true' ? 6 : sessionStorage.getItem(clave05Resuelto) === 'true' ? 5 : sessionStorage.getItem(clave04Resuelto) === 'true' ? 4 : resuelto ? 3 : 2;
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => { p.value = cantidad; });
        document.querySelector('.avance-general-fila strong').textContent = `${cantidad} / 7`;
        document.querySelector('.contador-progreso').textContent = `${cantidad} / 7 ACERTIJOS`;
        document.querySelector('.confianza-panel progress').value = cantidad;
    }

    function abrirRegistro() {
        if (!examinado) {
            examinado = true;
            sessionStorage.setItem(claveLectura, 'true');
            actualizar();
        }
        visor.showModal();
    }

    document.getElementById('ver-registro03').addEventListener('click', abrirRegistro);
    document.getElementById('abrir-registro03').addEventListener('click', abrirRegistro);
    document.getElementById('cerrar-registro03').addEventListener('click', () => visor.close());
    visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });

    botonResolver.addEventListener('click', () => {
        if (botonResolver.disabled) return;
        if (resuelto) mostrarRespuestaResuelta();
        dialogoAcertijo.showModal();
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();
        if (resuelto || !examinado) return;
        const seleccionada = formulario.querySelector('input[name="respuesta03"]:checked');
        if (!seleccionada) {
            estado.textContent = 'Selecciona una opción antes de comprobar.';
            return;
        }
        intentos++;
        if (seleccionada.value !== '2') {
            estado.textContent = `Intento ${intentos}: revisa la sección «Comunicado de cierre» del registro.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mostrarRespuestaResuelta();
        estado.textContent = '¡Correcto! Has completado el Acertijo 03. Progreso: 3 / 7.';
        actualizar();
    });

    radios.forEach(radio => radio.addEventListener('change', () => {
        if (!resuelto) estado.textContent = '';
    }));
    document.getElementById('cerrar-acertijo03').addEventListener('click', () => dialogoAcertijo.close());
    dialogoAcertijo.addEventListener('click', e => { if (e.target === dialogoAcertijo) dialogoAcertijo.close(); });

    if (resuelto) mostrarRespuestaResuelta();
    actualizar();
});
