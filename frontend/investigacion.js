/* LAST SEEN · INVESTIGACIÓN / EXPEDIENTE 001
   Documentos narrativos oficiales. Lecturas locales de demostración, no PostgreSQL.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }
    document.getElementById('investigador-activo').textContent = nombre;

    // Vista local sin fetch: funciona también al abrir el HTML directamente en el navegador.
    // Las versiones .txt originales están en recursos/documentos/expediente_001/.
    const documentos = {
        presentacion: {
            codigo: 'ARCHIVO RECUPERADO / EXPEDIENTE 001',
            titulo: 'PRESENTACIÓN DEL EQUIPO',
            parrafo1: 'El proyecto cuenta con tres integrantes responsables de las distintas áreas de producción.',
            parrafo2: '01. Frontend · 02. Backend · 03. Dirección Artística.',
            anotacion: '¿QUIÉNES FORMABAN EL EQUIPO?',
            pie: 'PRESENTACIÓN DEL EQUIPO · EXPEDIENTE 001',
            detalle: "ARCHIVO RECUPERADO · EXPEDIENTE 001\nDOCUMENTO\n\n\nPRESENTACIÓN DEL EQUIPO\nSecuela de un videojuego independiente de decisiones narrativas\n\nEQUIPO DE DESARROLLO\n\nEl proyecto cuenta con tres integrantes responsables de las distintas áreas de producción.\n\n01. Desarrollo Frontend\n\nResponsable de las interfaces, interacción visual y presentación de los elementos del videojuego.\n\n02. Desarrollo Backend\n\nResponsable de la lógica interna, los sistemas y el funcionamiento de los procesos del videojuego.\n\n03. Dirección Artística\n\nResponsable del diseño de personajes, ilustraciones, música y recursos visuales.",
            observacion: 'Pista: cuenta a las personas que integraban el equipo, no a las tareas individuales.'
        },
        comunicado: {
            codigo: 'ARCHIVO 002 / COMUNICADO OFICIAL',
            titulo: 'COMUNICADO OFICIAL DE CANCELACIÓN',
            parrafo1: 'Hemos tomado la difícil decisión de cancelar definitivamente el desarrollo de la secuela de nuestro videojuego.',
            parrafo2: 'Esta decisión responde a circunstancias internas y diferencias relacionadas con la dirección que estaba tomando el proyecto.',
            anotacion: '¿QUÉ NO EXPLICA EL COMUNICADO?',
            pie: 'COMUNICADO OFICIAL · EXPEDIENTE 001',
            detalle: "COMUNICADO OFICIAL\nARCHIVO 002\n\n\nAnuncio sobre el futuro del proyecto\nEquipo de desarrollo · Comunicado público\n\nA nuestra comunidad:\n\nDespués de un largo periodo de desarrollo y tras numerosas consideraciones internas, hemos tomado la difícil decisión de cancelar definitivamente el desarrollo de la secuela de nuestro videojuego.\n\nEsta decisión responde a circunstancias internas y diferencias relacionadas con la dirección que estaba tomando el proyecto.\n\nSabemos que muchos de ustedes esperaban este lanzamiento y que han acompañado nuestro trabajo desde el comienzo. Por eso, lamentamos profundamente no poder continuar con algo que tantas personas esperaban.\n\nAgradecemos el apoyo, la paciencia y el cariño que nos han brindado durante este tiempo.\n\nPor respeto a las personas involucradas, hemos decidido no realizar más declaraciones sobre los motivos de esta decisión.\n\nGracias por haber formado parte de este proyecto.\n\nEquipo de desarrollo\n\nEl comunicado original no contiene información adicional sobre la situación interna del equipo.",
            observacion: 'Este comunicado anuncia el cierre, pero no identifica individualmente a los integrantes del equipo.'
        }
    };

    const lista = [...document.querySelectorAll('[data-documento]')];
    const dialogo = document.getElementById('dialogo-prueba');
    const mensaje = document.getElementById('mensaje-investigacion');
    const claveLecturas = `lastSeen.demo.expediente001.v2.${encodeURIComponent(nombre)}.lecturas`;
    let actual = 'presentacion';
    let examinados = [];

    try {
        const datos = JSON.parse(sessionStorage.getItem(claveLecturas) || '[]');
        if (Array.isArray(datos)) examinados = datos.filter(id => Object.hasOwn(documentos, id));
    } catch {
        examinados = [];
    }

    function actualizarObjetivos() {
        for (const id of ['presentacion', 'comunicado']) {
            document.querySelector(`[data-objetivo="${id}"]`)?.classList.toggle('objetivo-completado', examinados.includes(id));
        }
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
        mensaje.textContent = `Seleccionaste: ${dato.titulo}. Pulsa «Examinar las pruebas» para leerlo.`;
    }

    function examinar() {
        const dato = documentos[actual];
        document.getElementById('dialogo-titulo').textContent = dato.titulo;
        document.getElementById('dialogo-descripcion').textContent = dato.detalle;
        document.getElementById('dialogo-observacion').textContent = dato.observacion;
        if (!examinados.includes(actual)) {
            examinados.push(actual);
            sessionStorage.setItem(claveLecturas, JSON.stringify(examinados));
            actualizarObjetivos();
        }
        // Un evento explícito evita depender del orden de ejecución entre scripts.
        window.dispatchEvent(new CustomEvent('lastSeen:documentoExaminado', { detail: { id: actual } }));
        dialogo.showModal();
    }

    lista.forEach(boton => boton.addEventListener('click', () => cambiarDocumento(boton.dataset.documento)));
    document.getElementById('examinar-pruebas').addEventListener('click', examinar);
    document.getElementById('ver-documentos').addEventListener('click', examinar);
    document.getElementById('ver-expedientes').addEventListener('click', () => cambiarDocumento('presentacion'));
    document.getElementById('cerrar-dialogo').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => { if (evento.target === dialogo) dialogo.close(); });
    actualizarObjetivos();
});
