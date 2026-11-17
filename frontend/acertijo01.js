/* LAST SEEN · ACERTIJO 01 / LA CANCELACIÓN
   Pregunta y opciones alineadas con datos_iniciales.sql.
   La resolución y la confianza son una demostración local, no una API ni PostgreSQL.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) return;
    const claveLecturas = `lastSeen.demo.expediente001.v2.${encodeURIComponent(nombre)}.lecturas`;
    const claveResuelto = `lastSeen.demo.expediente001.v2.${encodeURIComponent(nombre)}.resuelto`;
    const botonAbrir = document.getElementById('abrir-acertijo01');
    const requisito = document.getElementById('acertijo01-requisito');
    const dialogo = document.getElementById('dialogo-acertijo01');
    const formulario = document.getElementById('form-acertijo01');
    const mensaje = document.getElementById('respuesta-acertijo01-estado');
    const botonComprobar = document.getElementById('comprobar-acertijo01');
    const opciones = [...formulario.querySelectorAll('input[name="respuesta01"]')];
    let resuelto = sessionStorage.getItem(claveResuelto) === 'true';
    let intentosDemo = 0;

    function documentosExaminados() {
        try {
            const v = JSON.parse(sessionStorage.getItem(claveLecturas) || '[]');
            return Array.isArray(v) ? v : [];
        } catch {
            return [];
        }
    }

    function reflejarProgreso() {
        if (!resuelto) return;
        document.querySelector('[data-objetivo="acertijo"]')?.classList.add('objetivo-completado');
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => { p.value = 1; });
        document.querySelector('.avance-general-fila strong').textContent = '1 / 7';
        document.querySelector('.contador-progreso').textContent = '1 / 7 ACERTIJOS';
        const confianza = document.querySelector('.confianza-panel progress');
        if (confianza) confianza.value = 1;
        document.querySelector('.confianza-panel > p').textContent = 'PRIMER ACERCAMIENTO (DEMO)';
        // No inventamos testimonios: aún no están aprobados ni dados de alta en PostgreSQL.
        const box = document.querySelector('.testimonio-bloqueado');
        if (box) {
            box.replaceChildren();
            const titulo = document.createElement('strong');
            titulo.textContent = '▣  TESTIMONIO PENDIENTE';
            const info = document.createElement('p');
            info.textContent = 'Has avanzado en la investigación. El testimonio de la artista se incorporará cuando esté definido y registrado en la base de datos.';
            box.append(titulo, info);
        }
    }

    function actualizarAcceso() {
        const leidos = documentosExaminados();
        const faltantes = [
            !leidos.includes('presentacion') ? 'Presentación del equipo' : null,
            !leidos.includes('comunicado') ? 'Comunicado oficial' : null
        ].filter(Boolean);
        botonAbrir.disabled = faltantes.length > 0 && !resuelto;
        if (resuelto) {
            requisito.textContent = 'Acertijo resuelto en esta demostración local. El resultado todavía no está guardado en PostgreSQL.';
            botonAbrir.firstChild.textContent = 'REVISAR LA RESOLUCIÓN ';
        } else if (!faltantes.length) {
            requisito.textContent = 'Documentos examinados. Ya puedes responder utilizando la presentación del equipo.';
        } else {
            requisito.textContent = `Para responder, examina: ${faltantes.join(' y ')}.`;
        }
        reflejarProgreso();
    }

    window.addEventListener('lastSeen:documentoExaminado', actualizarAcceso);

    botonAbrir.addEventListener('click', () => {
        if (botonAbrir.disabled) return;
        mensaje.textContent = resuelto
            ? 'Respuesta correcta: tres integrantes (Frontend, Backend y Dirección Artística).'
            : '';
        if (resuelto) {
            const acertada = opciones.find(x => x.value === '3');
            if (acertada) acertada.checked = true;
            opciones.forEach(x => { x.disabled = true; });
            botonComprobar.disabled = true;
        }
        dialogo.showModal();
    });

    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        if (resuelto) return;
        const elegida = formulario.querySelector('input[name="respuesta01"]:checked');
        if (!elegida) {
            mensaje.textContent = 'Selecciona una respuesta antes de comprobarla.';
            return;
        }
        intentosDemo++;
        if (elegida.value !== '3') {
            mensaje.textContent = `Intento ${intentosDemo}: revisa la presentación. Cuenta a los integrantes, no las áreas ni las tareas.`;
            return;
        }
        resuelto = true;
        sessionStorage.setItem(claveResuelto, 'true');
        mensaje.textContent = '¡Correcto! El equipo estaba formado por tres integrantes: Desarrollo Frontend, Desarrollo Backend y Dirección Artística.';
        opciones.forEach(x => { x.disabled = true; });
        botonComprobar.disabled = true;
        actualizarAcceso();
    });

    document.getElementById('cerrar-acertijo01').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => { if (evento.target === dialogo) dialogo.close(); });
    opciones.forEach(x => x.addEventListener('change', () => { if (!resuelto) mensaje.textContent = ''; }));
    actualizarAcceso();
});
