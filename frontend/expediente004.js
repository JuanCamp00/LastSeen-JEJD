/* LAST SEEN · EXPEDIENTE 004 / LA ARTISTA DESAPARECIDA
   Interfaz/progreso de demostración mediante sessionStorage.
   Validación definitiva: backend (sin solicitudes HTTP en este archivo).
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    const id = encodeURIComponent(nombre);
    const clave03 = `lastSeen.demo.expediente003.v1.${id}.resuelto`;
    if (sessionStorage.getItem(clave03) !== 'true') {
        window.location.replace('./expediente003.html');
        return;
    }
    const base = `lastSeen.demo.expediente004.v1.${id}`;
    const claveLectura = `${base}.lectura`;
    const claveResuelto = `${base}.resuelto`;
    const clave05Resuelto = `lastSeen.demo.expediente005.v1.${id}.resuelto`;
    const clave06Resuelto = `lastSeen.demo.expediente006.v1.${id}.resuelto`;
    const clave07Resuelto = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
    const visor = document.getElementById('dialogo-publicaciones04');
    const dialogoAcertijo = document.getElementById('dialogo-acertijo04');
    const botonResolver = document.getElementById('abrir-acertijo04');
    const requisito = document.getElementById('acertijo04-requisito');
    const formulario = document.getElementById('form-acertijo04');
    const respuesta = document.getElementById('respuesta04');
    const estado = document.getElementById('respuesta-acertijo04-estado');
    const comprobar = document.getElementById('comprobar-acertijo04');
    const estadoAnalisis = document.getElementById('estado-analisis04');
    let examinado = sessionStorage.getItem(claveLectura) === 'true';
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentos = 0;

    document.getElementById('investigador-activo').textContent = nombre;

    function normalizar(texto) {
        return texto.toLocaleLowerCase('es')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    function respuestaCorrecta(texto) {
        const valor = normalizar(texto);
        // La respuesta oficial de datos_iniciales.sql es:
        // «Sus ilustraciones y avances musicales.»
        const ilustraciones = /\b(ilustracion(?:es)?|dibujos?|arte|obras? artisticas?|trabajos? artisticos?)\b/.test(valor);
        const musica = /\b(musica|musical(?:es)?|composicion(?:es)?|cancion(?:es)?|melodias?|piezas? musicales?)\b/.test(valor);
        return ilustraciones && musica;
    }

    function mostrarResuelto() {
        respuesta.value = 'Sus ilustraciones y avances musicales.';
        respuesta.readOnly = true;
        comprobar.disabled = true;
        estado.textContent = 'Correcto: dejó de compartir ilustraciones y avances musicales.';
    }

    function actualizar() {
        document.getElementById('objetivo-publicaciones04').classList.toggle('objetivo-completado', examinado);
        document.getElementById('objetivo-acertijo04').classList.toggle('objetivo-completado', resuelto);
        botonResolver.disabled = !examinado && !resuelto;
        requisito.textContent = resuelto
            ? 'Acertijo 04 resuelto. El progreso se guarda temporalmente en este navegador.'
            : examinado
                ? 'Archivo examinado. Ya puedes escribir tu conclusión.'
                : 'Examina el archivo de publicaciones antes de responder.';
        estadoAnalisis.textContent = resuelto
            ? '●  ACERTIJO 04 RESUELTO'
            : examinado ? '●  PUBLICACIONES EXAMINADAS' : '●  ANÁLISIS PENDIENTE';
        botonResolver.textContent = resuelto ? 'REVISAR RESPUESTA 04 →' : 'RESOLVER ACERTIJO 04 →';
        const cantidad = sessionStorage.getItem(clave07Resuelto) === 'true' ? 7 : sessionStorage.getItem(clave06Resuelto) === 'true' ? 6 : sessionStorage.getItem(clave05Resuelto) === 'true' ? 5 : resuelto ? 4 : 3;
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
    document.getElementById('ver-publicaciones04').addEventListener('click', abrirDocumento);
    document.getElementById('abrir-publicaciones04').addEventListener('click', abrirDocumento);
    document.getElementById('cerrar-publicaciones04').addEventListener('click', () => visor.close());
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
            estado.textContent = `Intento ${intentos}: compara las publicaciones anteriores con la última localizada.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mostrarResuelto();
        estado.textContent = '¡Correcto! Has completado el Acertijo 04. Progreso: 4 / 7.';
        actualizar();
    });
    document.getElementById('cerrar-acertijo04').addEventListener('click', () => dialogoAcertijo.close());
    dialogoAcertijo.addEventListener('click', e => { if (e.target === dialogoAcertijo) dialogoAcertijo.close(); });
    respuesta.addEventListener('input', () => { if (!resuelto) estado.textContent = ''; });

    if (resuelto) mostrarResuelto();
    actualizar();
});
