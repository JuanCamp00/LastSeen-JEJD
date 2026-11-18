/* LAST SEEN · Integración de las funciones de investigación con PostgreSQL.
   Ranking deliberadamente fuera de esta integración. */
(() => {
    'use strict';

    const API = 'http://localhost:3000/api';
    const KEYS = {
        userId: 'lastSeen.idUsuario',
        userName: 'lastSeen.nombreInvestigador',
        gameId: 'lastSeen.idPartida',
        solved: 'lastSeen.ordenResuelto'
    };
    const get = key => sessionStorage.getItem(key);
    const set = (key, value) => sessionStorage.setItem(key, String(value));
    const pageOrder = (() => {
        const match = location.pathname.match(/expediente(\d{3})\.html$/i);
        return match ? Number(match[1]) : /investigacion\.html$/i.test(location.pathname) ? 1 : 0;
    })();
    const pageForOrder = order => order <= 1 ? './investigacion.html' : order <= 7 ? `./expediente${String(order).padStart(3, '0')}.html` : './informe-final.html';

    // Mantener compatibles los controles locales antiguos: el estado real viene del backend.
    function sincronizarMarcasLocales(hasta) {
        const nombre = get(KEYS.userName) || '';
        if (!nombre) return;
        for (let n = 1; n <= Math.min(7, hasta); n++) {
            const codigo = String(n).padStart(3, '0');
            const version = n === 1 ? 'v2' : 'v1';
            set(`lastSeen.demo.expediente${codigo}.${version}.${encodeURIComponent(nombre)}.resuelto`, 'true');
        }
    }
    sincronizarMarcasLocales(Number(get(KEYS.solved) || 0));

    async function request(path, options = {}) {
        const response = await fetch(`${API}${path}`, {
            ...options,
            headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
        });
        const type = response.headers.get('content-type') || '';
        const body = type.includes('application/json') ? await response.json() : await response.text();
        if (!response.ok) throw new Error(body?.mensaje || body || `Error HTTP ${response.status}`);
        return body;
    }
    const json = data => ({ method: 'POST', body: JSON.stringify(data) });

    function aviso(texto, error = false) {
        let node = document.getElementById('lastseen-api-aviso');
        if (!node) {
            node = document.createElement('p');
            node.id = 'lastseen-api-aviso';
            node.setAttribute('role', 'status');
            node.setAttribute('aria-live', 'polite');
            node.style.cssText = 'position:fixed;z-index:99999;left:50%;bottom:22px;transform:translateX(-50%);max-width:min(92vw,680px);padding:12px 18px;background:#15191c;color:#f3eee4;border:1px solid #a88d63;border-radius:6px;font:13px/1.5 monospace;box-shadow:0 8px 30px #0008';
            document.body.appendChild(node);
        }
        node.textContent = texto;
        node.style.borderColor = error ? '#c66b65' : '#a88d63';
    }

    function crearModal() {
        let dialog = document.getElementById('lastseen-api-documento');
        if (dialog) return dialog;
        const style = document.createElement('style');
        style.textContent = '#lastseen-api-documento{width:min(760px,92vw);max-height:85vh;overflow:auto;background:#15191c;color:#eee8dc;border:1px solid #9d835d;padding:28px}#lastseen-api-documento::backdrop{background:#050708dd}#lastseen-api-documento h2{font:700 1.2rem Orbitron,monospace;letter-spacing:.08em}#lastseen-api-documento pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.8 "IBM Plex Mono",monospace;color:#e7dfd0}#lastseen-api-documento button{background:transparent;color:#eee8dc;border:1px solid #9d835d;padding:9px 14px;cursor:pointer}';
        document.head.appendChild(style);
        dialog = document.createElement('dialog');
        dialog.id = 'lastseen-api-documento';
        dialog.innerHTML = '<p style="font:11px monospace;letter-spacing:.15em">LAST SEEN / ARCHIVO RECUPERADO</p><h2></h2><pre></pre><button type="button">CERRAR ARCHIVO</button>';
        dialog.querySelector('button').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        document.body.appendChild(dialog);
        return dialog;
    }

    async function abrirContenido(idContenido) {
        const idPartida = Number(get(KEYS.gameId));
        if (!idPartida) throw new Error('Primero debes iniciar la investigación.');
        const data = await request(`/contenidos/partidas/${idPartida}/${idContenido}/archivo`);
        const modal = crearModal();
        modal.querySelector('h2').textContent = `DOCUMENTO ${String(idContenido).padStart(3, '0')}`;
        modal.querySelector('pre').textContent = data;
        modal.showModal();
        const nombre = get(KEYS.userName) || '';
        if (pageOrder === 1 && nombre) {
            const key = `lastSeen.demo.expediente001.v2.${encodeURIComponent(nombre)}.lecturas`;
            let lecturas = [];
            try { lecturas = JSON.parse(get(key) || '[]'); } catch { lecturas = []; }
            const tipo = idContenido === 1 ? 'presentacion' : 'comunicado';
            if (!lecturas.includes(tipo)) lecturas.push(tipo);
            set(key, JSON.stringify(lecturas));
            window.dispatchEvent(new CustomEvent('lastSeen:documentoExaminado', { detail: { id: tipo } }));
        } else if (nombre && pageOrder > 1) {
            const version = 'v1';
            set(`lastSeen.demo.expediente${String(pageOrder).padStart(3, '0')}.${version}.${encodeURIComponent(nombre)}.lectura`, 'true');
            const boton = document.querySelector(`#abrir-acertijo${String(pageOrder).padStart(2, '0')}`);
            if (boton) boton.disabled = false;
        }
        aviso('Documento recuperado desde el servidor.');
    }

    async function cargarPartidaActual() {
        const idPartida = Number(get(KEYS.gameId));
        if (!idPartida) return null;
        const actual = await request(`/acertijos/partidas/${idPartida}/actual`);
        const order = Number(actual.acertijo?.orden || actual.progreso?.orden || actual.acertijo?.id_acertijo || 0);
        const progreso = await request(`/progreso/partidas/${idPartida}`);
        const solved = progreso.juegoFinalizado ? 7 : Math.max(0, order - 1);
        set(KEYS.solved, solved);
        sincronizarMarcasLocales(solved);
        return { actual, progreso, order };
    }

    function renderizarAcertijo(actual) {
        const puzzle = actual.acertijo;
        if (!puzzle || !pageOrder) return;
        const order = Number(puzzle.orden || pageOrder);
        const form = document.getElementById(`form-acertijo${String(order).padStart(2, '0')}`);
        if (!form) return;
        const heading = document.getElementById(`titulo-pregunta${String(order).padStart(2, '0')}`)
            || document.getElementById(`titulo-pregunta-${String(order).padStart(2, '0')}`)
            || document.getElementById(`titulo-acertijo${String(order).padStart(2, '0')}`);
        if (heading && puzzle.pregunta) heading.textContent = puzzle.pregunta;
        const questionText = form.querySelector('.enunciado-acertijo01, .exp02-pregunta, .exp03-pregunta');
        if (questionText && puzzle.pregunta) questionText.textContent = puzzle.pregunta;
        const radioLabels = [...form.querySelectorAll('label')].filter(label => label.querySelector('input[type="radio"]'));
        if (puzzle.tipo_validacion === 'SELECCION' && Array.isArray(actual.opciones)) {
            const container = radioLabels[0]?.parentElement;
            if (container) {
                radioLabels.forEach(label => label.remove());
                actual.opciones.forEach(option => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `respuesta${String(order).padStart(2, '0')}`;
                    input.value = String(option.id_opcion);
                    input.required = true;
                    label.append(input, document.createTextNode(` ${option.texto_opcion}`));
                    container.appendChild(label);
                });
            }
        }
        form.dataset.idAcertijo = String(puzzle.id_acertijo);
        form.dataset.tipoValidacion = puzzle.tipo_validacion;
    }

    async function actualizarPanel() {
        const idPartida = Number(get(KEYS.gameId));
        if (!idPartida) return;
        const [progresoData, intentosData, contenidosData] = await Promise.all([
            request(`/progreso/partidas/${idPartida}`),
            request(`/intentos/partidas/${idPartida}`),
            request(`/contenidos/partidas/${idPartida}`)
        ]);
        const current = progresoData.progreso?.id_acertijo_actual;
        const solved = progresoData.juegoFinalizado ? 7 : Math.max(0, Number(current || 1) - 1);
        set(KEYS.solved, solved);
        sincronizarMarcasLocales(solved);
        document.querySelectorAll('progress').forEach(bar => {
            if (bar.max === 7 || bar.closest('.progreso, .confianza-panel, .progreso-panel')) {
                bar.max = 7;
                bar.value = solved;
            }
        });
        const stats = document.querySelectorAll('.progreso dl dd');
        if (stats.length >= 2) {
            stats[0].textContent = progresoData.juegoFinalizado ? '1' : '0';
            stats[1].textContent = String(solved);
        }
        const activity = document.querySelector('.actividad-reciente small');
        if (activity) activity.textContent = `${intentosData.totalIntentos} intentos registrados · ${contenidosData.contenidos.length} documentos disponibles en el servidor.`;
    }

    async function iniciarPartida(event) {
        event.preventDefault();
        const idUsuario = Number(get(KEYS.userId));
        if (!idUsuario) {
            aviso('No encontramos el identificador del investigador. Vuelve a iniciar sesión.', true);
            return;
        }
        const link = event.target.closest('a.boton-investigacion');
        link.setAttribute('aria-busy', 'true');
        try {
            let idPartida = Number(get(KEYS.gameId));
            if (!idPartida) {
                const recuperacion = await request(`/partidas/usuario/${idUsuario}/activa`);
                idPartida = Number(recuperacion.partida?.id_partida) || 0;
            }
            if (!idPartida) {
                const result = await request('/partidas/iniciar', json({ idUsuario }));
                idPartida = Number(result.partida?.id_partida);
                if (!Number.isInteger(idPartida) || idPartida <= 0) throw new Error('El servidor no devolvió el identificador de la partida.');
                set(KEYS.solved, 0);
            }
            set(KEYS.gameId, idPartida);
            const state = await cargarPartidaActual();
            location.href = state?.progreso?.juegoFinalizado ? './informe-final.html' : pageForOrder(state?.order || 1);
        } catch (error) {
            aviso(error.message || 'No se pudo iniciar la investigación.', true);
            link.removeAttribute('aria-busy');
        }
    }

    async function resolverFormulario(form, event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const idPartida = Number(get(KEYS.gameId));
        const order = Number(form.id.match(/(\d+)/)?.[1]);
        const idAcertijo = Number(form.dataset.idAcertijo);
        const tipo = form.dataset.tipoValidacion;
        const status = document.getElementById(`respuesta-acertijo${String(order).padStart(2, '0')}-estado`);
        const button = form.querySelector('button[type="submit"]');
        if (!idPartida || !idAcertijo) {
            if (status) status.textContent = 'No se encontró una partida activa. Vuelve al inicio e inicia la investigación.';
            return;
        }
        const body = { idAcertijo };
        if (tipo === 'SELECCION') {
            const selected = form.querySelector('input[type="radio"]:checked');
            if (!selected) { if (status) status.textContent = 'Selecciona una opción.'; return; }
            body.idOpcionSeleccionada = Number(selected.value);
        } else {
            const field = form.querySelector('textarea, input[type="text"]');
            const value = field?.value?.trim() || '';
            if (!value) { if (status) status.textContent = 'Escribe tu respuesta.'; return; }
            body.respuestaTexto = value;
        }
        if (button) button.disabled = true;
        if (status) status.textContent = 'Verificando respuesta y guardando el intento...';
        try {
            const result = await request(`/acertijos/partidas/${idPartida}/resolver`, json(body));
            if (!result.correcto) {
                if (status) status.textContent = result.mensaje || 'Respuesta incorrecta. Puedes intentarlo de nuevo.';
                return;
            }
            set(KEYS.solved, order);
            sincronizarMarcasLocales(order);
            if (status) status.textContent = result.mensaje || 'Respuesta correcta. Progreso guardado.';
            await actualizarPanel().catch(() => {});
            if (result.juegoFinalizado || result.siguienteAcertijoId === null) {
                location.href = './informe-final.html';
            } else {
                location.href = pageForOrder(order + 1);
            }
        } catch (error) {
            if (status) status.textContent = error.message || 'No se pudo registrar la respuesta.';
        } finally {
            if (button) button.disabled = false;
        }
    }

    async function solicitarPista() {
        const idPartida = Number(get(KEYS.gameId));
        if (!idPartida) throw new Error('No hay una investigación activa.');
        const actual = await request(`/acertijos/partidas/${idPartida}/actual`);
        const idAcertijo = Number(actual.acertijo?.id_acertijo);
        const disponible = await request(`/pistas/partidas/${idPartida}`);
        const pistas = disponible.pistas || [];
        const pista = pistas.find(item => Number(item.id_acertijo) === idAcertijo);
        if (!pista) throw new Error('Todavía no hay una pista desbloqueada para este acertijo.');
        const saved = await request(`/pistas/partidas/${idPartida}/${pista.id_pista}/guardar`, json({}));
        const texto = saved.pista?.contenido || pista.contenido;
        const modal = crearModal();
        modal.querySelector('h2').textContent = 'PISTA RECUPERADA';
        modal.querySelector('pre').textContent = texto;
        modal.showModal();
        aviso('Pista consultada y guardada en PostgreSQL.');
    }

    // Cerrar sesión también limpia los identificadores de esta investigación.
    document.addEventListener('click', event => {
        if (event.target.closest('#cerrar-sesion')) {
            ['lastSeen.idUsuario', 'lastSeen.nombreInvestigador', 'lastSeen.idPartida', 'lastSeen.ordenResuelto'].forEach(key => sessionStorage.removeItem(key));
        }
    }, true);

    // Iniciar la partida desde el CTA del panel principal.
    document.addEventListener('click', event => {
        const start = event.target.closest('a.boton-investigacion');
        if (start) iniciarPartida(event);
    }, true);

    // Abrir documentos reales desde la API.
    document.addEventListener('click', event => {
        const target = event.target.closest('button, a');
        if (!target) return;
        const id = target.id || '';
        let contentId = null;
        if (pageOrder === 1 && (id === 'examinar-pruebas' || id === 'ver-documentos')) {
            const selected = document.querySelector('[data-documento].seleccionado')?.dataset.documento
                || document.querySelector('[data-documento][aria-pressed="true"]')?.dataset.documento || 'presentacion';
            contentId = selected === 'comunicado' ? 2 : 1;
        } else if (pageOrder > 1 && (/^(ver-|abrir-)/.test(id)) && !id.includes('acertijo')) {
            contentId = pageOrder + 1;
        }
        if (contentId) {
            event.preventDefault();
            event.stopImmediatePropagation();
            abrirContenido(contentId).catch(error => aviso(error.message, true));
        }
        if (target.matches('.boton-pista-lastseen') || /PISTAS/.test(target.textContent || '') && target.closest('.pestanas-investigacion')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            solicitarPista().catch(error => aviso(error.message, true));
        }
    }, true);

    // Enviar cada respuesta al endpoint real; el backend registra el intento y actualiza progreso.
    document.addEventListener('submit', event => {
        const form = event.target;
        if (!(form instanceof HTMLFormElement) || !/^form-acertijo0[1-7]$/.test(form.id)) return;
        resolverFormulario(form, event);
    }, true);

    document.addEventListener('DOMContentLoaded', async () => {
        const nombre = get(KEYS.userName);
        if (!nombre) return;
        document.getElementById('investigador-activo')?.replaceChildren(document.createTextNode(nombre));
        document.getElementById('nombre-perfil')?.replaceChildren(document.createTextNode(nombre));
        if (location.pathname.endsWith('/inicio.html')) {
            await actualizarPanel().catch(error => aviso(error.message, true));
            return;
        }
        if (!pageOrder) return;
        const idPartida = Number(get(KEYS.gameId));
        if (!idPartida) {
            location.replace('./inicio.html');
            return;
        }
        try {
            const state = await cargarPartidaActual();
            if (state.progreso.juegoFinalizado) {
                location.replace('./informe-final.html');
                return;
            }
            if (state.order && state.order !== pageOrder) {
                location.replace(pageForOrder(state.order));
                return;
            }
            renderizarAcertijo(state.actual);
            await actualizarPanel();
        } catch (error) {
            aviso(error.message || 'No se pudo recuperar la investigación.', true);
        }
    });
})();
