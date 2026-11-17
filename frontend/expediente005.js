/* LAST SEEN · EXPEDIENTE 005 / LO QUE LOS UNÍA
   Lógica local provisional; no accede al backend ni a PostgreSQL.
   Pregunta y cuatro opciones alineadas con datos_iniciales.sql.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const id = encodeURIComponent(nombre);
    const clave04 = `lastSeen.demo.expediente004.v1.${id}.resuelto`;
    if (sessionStorage.getItem(clave04) !== 'true') {
        window.location.replace('./expediente004.html');
        return;
    }

    const base = `lastSeen.demo.expediente005.v1.${id}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const clave06Resuelto = `lastSeen.demo.expediente006.v1.${id}.resuelto`;
    const clave07Resuelto = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
    const visor = document.getElementById('dialogo-registro05');
    const dialogoAcertijo = document.getElementById('dialogo-acertijo05');
    const botonResolver = document.getElementById('abrir-acertijo05');
    const requisito = document.getElementById('acertijo05-requisito');
    const formulario = document.getElementById('form-acertijo05');
    const estado = document.getElementById('respuesta-acertijo05-estado');
    const comprobar = document.getElementById('comprobar-acertijo05');
    const radios = [...document.querySelectorAll('input[name="respuesta05"]')];
    const estadoAnalisis = document.getElementById('estado-analisis05');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentos = 0;

    document.getElementById('investigador-activo').textContent = nombre;

    function mostrarRespuestaResuelta() {
        const correcta = radios.find(radio => radio.value === '2');
        if (correcta) correcta.checked = true;
        radios.forEach(radio => { radio.disabled = true; });
        comprobar.disabled = true;
        estado.textContent = 'Correcto: mantenían una relación sentimental y trabajaban juntos.';
    }

    function actualizar() {
        document.getElementById('objetivo-registro05').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo05').classList.toggle('objetivo-completado', resuelto);
        botonResolver.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 05 resuelto. El resultado se ha guardado solo para esta sesión.'
            : examinado ? 'Documento examinado. Ya puedes responder.'
                : 'Examina el registro de colaboración antes de responder.';
        estadoAnalisis.textContent = resuelto
            ? '●  ACERTIJO 05 RESUELTO'
            : examinado ? '●  REGISTRO EXAMINADO' : '●  ANÁLISIS PENDIENTE';
        botonResolver.textContent = resuelto ? 'REVISAR RESPUESTA 05 →' : 'RESOLVER ACERTIJO 05 →';
        const cantidad = sessionStorage.getItem(clave07Resuelto) === 'true' ? 7 : sessionStorage.getItem(clave06Resuelto) === 'true' ? 6 : resuelto ? 5 : 4;
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
    document.getElementById('ver-registro05').addEventListener('click', abrirDocumento);
    document.getElementById('abrir-registro05').addEventListener('click', abrirDocumento);
    document.getElementById('cerrar-registro05').addEventListener('click', () => visor.close());
    visor.addEventListener('click', e => { if (e.target === visor) visor.close(); });

    botonResolver.addEventListener('click', () => {
        if (botonResolver.disabled) return;
        if (resuelto) mostrarRespuestaResuelta();
        dialogoAcertijo.showModal();
    });
    formulario.addEventListener('submit', e => {
        e.preventDefault();
        if (resuelto || !examinado) return;
        const seleccionada = formulario.querySelector('input[name="respuesta05"]:checked');
        if (!seleccionada) {
            estado.textContent = 'Selecciona una opción antes de comprobar.';
            return;
        }
        intentos++;
        if (seleccionada.value !== '2') {
            estado.textContent = `Intento ${intentos}: vuelve a leer el fragmento de la nota personal.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mostrarRespuestaResuelta();
        estado.textContent = '¡Correcto! Has completado el Acertijo 05. Progreso: 5 / 7.';
        actualizar();
    });
    radios.forEach(radio => radio.addEventListener('change', () => { if (!resuelto) estado.textContent = ''; }));
    document.getElementById('cerrar-acertijo05').addEventListener('click', () => dialogoAcertijo.close());
    dialogoAcertijo.addEventListener('click', e => { if (e.target === dialogoAcertijo) dialogoAcertijo.close(); });

    if (resuelto) mostrarRespuestaResuelta();
    actualizar();
});
