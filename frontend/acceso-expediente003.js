/* Muestra acceso al Expediente 003 tras completar el 002.
   Cargar DESPUÉS de expediente002.js; no usa servicios del backend.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    const pie = document.querySelector('.indice-pie');
    if (!nombre || !pie) return;
    const id = encodeURIComponent(nombre);
    const clave02 = `lastSeen.demo.expediente002.v1.${id}.resuelto`;
    const enlace = document.createElement('a');
    enlace.href = './expediente003.html';
    enlace.className = 'archivo-indice';
    enlace.style.textDecoration = 'none';
    enlace.textContent = '▣  003 — UN PASADO OLVIDADO →';
    enlace.setAttribute('aria-label', 'Abrir expediente 003: Un pasado olvidado');
    enlace.hidden = true;
    enlace.style.display = 'none';
    pie.insertBefore(enlace, pie.querySelector('.archivo-bloqueado'));


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
        const desbloqueado = sessionStorage.getItem(clave02) === 'true';
        enlace.hidden = !desbloqueado;
        enlace.style.display = desbloqueado ? 'flex' : 'none';
        actualizarEstadoIndice();
    }

    // Se ejecuta después del envío del formulario registrado en expediente002.js.
    document.getElementById('form-acertijo02')?.addEventListener('submit', actualizarAcceso);
    window.addEventListener('pageshow', actualizarAcceso);
    actualizarAcceso();
});
