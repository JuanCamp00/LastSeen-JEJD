/* ==============================================
   LAST SEEN · PANTALLA 04 / INVESTIGACIÓN
   Versión inicial de la interfaz, SIN backend.
   La lectura de pruebas se registra solo en la
   sesión del navegador, NO como acertijo resuelto.
============================================== */

document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    document.getElementById('investigador-activo').textContent = nombre;

    // Contenido provisional: se sustituirá por datos reales del backend.
    const documentos = {
        comunicado: {
            codigo: 'REGISTRO 001 / COMUNICADO',
            titulo: 'COMUNICADO OFICIAL',
            parrafo1: 'El equipo anunció la cancelación de la secuela del videojuego independiente.',
            parrafo2: 'No se explicaron los motivos del cierre.',
            anotacion: '¿QUIÉN AUTORIZÓ EL COMUNICADO?',
            pie: 'ARCHIVO CONSERVADO · FUENTE PENDIENTE',
            detalle: 'El comunicado confirma la cancelación, pero no explica qué sucedió dentro del equipo. Tampoco aclara quién redactó o aprobó el mensaje.',
            observacion: 'Pregunta abierta: ¿todos los integrantes estuvieron de acuerdo con publicarlo?'
        },
        captura: {
            codigo: 'REGISTRO 002 / CAPTURA',
            titulo: 'CAPTURA ARCHIVADA',
            parrafo1: 'Se conserva una captura de un espacio de trabajo asociado al proyecto.',
            parrafo2: 'No se ha verificado cuándo fue tomada ni quién la conservó.',
            anotacion: '¿QUÉ INFORMACIÓN FALTA EN LA IMAGEN?',
            pie: 'MATERIAL VISUAL · ORIGEN POR VERIFICAR',
            detalle: 'Una imagen del estudio aparece en los materiales recuperados. Por ahora, su procedencia y su fecha siguen siendo desconocidas.',
            observacion: 'Esta ilustración es provisional; más adelante usaremos la evidencia visual definitiva.'
        },
        registro: {
            codigo: 'REGISTRO 003 / ACTIVIDAD',
            titulo: 'REGISTRO DE ACTIVIDAD',
            parrafo1: 'Se encontraron referencias a modificaciones recientes del proyecto.',
            parrafo2: 'No es posible reconstruir todavía quién realizó cada cambio.',
            anotacion: '¿HUBO ACTIVIDAD DESPUÉS DEL ANUNCIO?',
            pie: 'REGISTROS PARCIALES · SIN VALIDACIÓN',
            detalle: 'Los registros técnicos que se recuperarán en el caso deberán ayudar a establecer una cronología de acontecimientos.',
            observacion: 'Las fechas y entradas concretas están pendientes de definir con la historia y la base de datos.'
        },
        comunidad: {
            codigo: 'REGISTRO 004 / COMUNIDAD',
            titulo: 'NOTAS DE LA COMUNIDAD',
            parrafo1: 'Algunos seguidores comenzaron a recopilar entrevistas y publicaciones antiguas.',
            parrafo2: 'Sus hipótesis no constituyen pruebas por sí mismas.',
            anotacion: '¿QUÉ RELATOS SE CONTRADICEN?',
            pie: 'RECOPILACIÓN DE FANS · SIN CONFIRMAR',
            detalle: 'La comunidad reunió fragmentos de entrevistas y publicaciones del estudio. Es importante diferenciar hechos comprobados de rumores.',
            observacion: 'Una investigación rigurosa deberá contrastar cada afirmación con evidencias independientes.'
        }
    };

    const lista = [...document.querySelectorAll('[data-documento]')];
    const dialogo = document.getElementById('dialogo-prueba');
    const botonExaminar = document.getElementById('examinar-pruebas');
    const mensaje = document.getElementById('mensaje-investigacion');
    const claveVistas = 'lastSeen.expediente001.documentosExaminados';
    let actual = 'comunicado';
    let examinados = [];

    try {
        const guardado = JSON.parse(sessionStorage.getItem(claveVistas) || '[]');
        if (Array.isArray(guardado)) examinados = guardado.filter(id => Object.hasOwn(documentos, id));
    } catch {
        examinados = [];
    }

    function actualizarObjetivos() {
        for (const id of ['comunicado', 'captura', 'registro']) {
            const fila = document.querySelector(`[data-objetivo="${id}"]`);
            fila.classList.toggle('objetivo-completado', examinados.includes(id));
        }
        // Resolver acertijos y sumar confianza se conectarán después al backend.
    }

    function cambiarDocumento(id) {
        const dato = documentos[id];
        if (!dato) return;
        actual = id;
        document.getElementById('documento-codigo').textContent = dato.codigo;
        document.getElementById('documento-titulo').textContent = dato.titulo;
        document.getElementById('documento-parrafo-1').textContent = dato.parrafo1;
        document.getElementById('documento-parrafo-2').textContent = dato.parrafo2;
        document.getElementById('documento-anotacion').textContent = dato.anotacion;
        document.getElementById('documento-pie').textContent = dato.pie;
        for (const boton of lista) {
            const seleccionado = boton.dataset.documento === id;
            boton.classList.toggle('seleccionado', seleccionado);
            boton.setAttribute('aria-pressed', String(seleccionado));
        }
        mensaje.textContent = `Documento seleccionado: ${dato.titulo}. Pulsa «Examinar las pruebas» para leerlo.`;
    }

    function examinar() {
        const dato = documentos[actual];
        document.getElementById('dialogo-titulo').textContent = dato.titulo;
        document.getElementById('dialogo-descripcion').textContent = dato.detalle;
        document.getElementById('dialogo-observacion').textContent = dato.observacion;
        if (!examinados.includes(actual)) {
            examinados.push(actual);
            sessionStorage.setItem(claveVistas, JSON.stringify(examinados));
            actualizarObjetivos();
        }
        dialogo.showModal();
    }

    lista.forEach(boton => boton.addEventListener('click', () => cambiarDocumento(boton.dataset.documento)));
    botonExaminar.addEventListener('click', examinar);
    document.getElementById('ver-documentos').addEventListener('click', examinar);
    document.getElementById('ver-expedientes').addEventListener('click', () => cambiarDocumento('comunicado'));
    document.getElementById('cerrar-dialogo').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => { if (evento.target === dialogo) dialogo.close(); });

    actualizarObjetivos();
});
