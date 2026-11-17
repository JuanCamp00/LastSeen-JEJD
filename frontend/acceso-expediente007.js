/* LAST SEEN · Acceso al Expediente 007 desde el 006.
   Cargar DESPUÉS de expediente006.js; progreso solo en sessionStorage.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    const pie = document.querySelector('.indice-pie');
    if (!nombre || !pie) return;
    const id = encodeURIComponent(nombre);
    const clave06 = `lastSeen.demo.expediente006.v1.${id}.resuelto`;
    const clave07 = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
    const enlace = document.createElement('a');
    enlace.href = './expediente007.html';
    enlace.className = 'archivo-indice';
    enlace.style.textDecoration = 'none';
    enlace.textContent = '▣  007 — LA ÚLTIMA PIEZA →';
    enlace.setAttribute('aria-label', 'Abrir expediente 007: La última pieza');
    enlace.hidden = true;
    enlace.style.display = 'none';
    const bloqueados = pie.querySelector('.archivo-bloqueado');
    pie.insertBefore(enlace, bloqueados);


// Mantiene el estado del índice coherente con los siete acertijos de esta sesión.
function contarResueltos() {
    let resueltos = 0;
    for (let numero = 1; numero <= 7; numero++) {
        const sufijo = String(numero).padStart(3, '0');
        const version = numero === 1 ? 'v2' : 'v1';
        const clave = `lastSeen.demo.expediente${sufijo}.${version}.${encodeURIComponent(nombre)}.resuelto`;
        if (sessionStorage.getItem(clave) !== 'true') break;
        resueltos++;
    }
    return resueltos;
}

function actualizarEstadoIndice() {
    const resueltos = contarResueltos();
    const recuperados = Math.min(resueltos + 1, 7);
    const aviso = pie.querySelector('.archivo-bloqueado');
    if (aviso) {
        if (resueltos === 7) {
            aviso.textContent = '▣  TODOS LOS EXPEDIENTES COMPLETADOS';
        } else if (recuperados === 7) {
            aviso.textContent = '▣  TODOS LOS EXPEDIENTES DESBLOQUEADOS';
        } else {
            const siguiente = String(recuperados + 1).padStart(3, '0');
            aviso.textContent = recuperados === 6
                ? '▧  007 / BLOQUEADO'
                : `▧  ${siguiente} — 007 / BLOQUEADOS`;
        }
    }
    const contador = pie.querySelector('small');
    if (contador) contador.textContent = `RECUPERADOS ${String(recuperados).padStart(2,'0')} / 07`;
    return { resueltos, recuperados };
}

    function actualizarAcceso() {
        const desbloqueado = sessionStorage.getItem(clave06) === 'true';
        enlace.hidden = !desbloqueado;
        enlace.style.display = desbloqueado ? 'flex' : 'none';
        actualizarEstadoIndice();
    }

    // Expediente006.js guarda la respuesta correcta antes de este listener.
    document.getElementById('form-acertijo06')?.addEventListener('submit', actualizarAcceso);
    window.addEventListener('pageshow', actualizarAcceso);
    actualizarAcceso();
});
