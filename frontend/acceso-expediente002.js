/* LAST SEEN · Índice de expedientes 001–007.
   Solo frontend: desbloqueos provisionales en sessionStorage.
   Cargar después de acertijo01.js. No conecta con la API.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    const pie = document.querySelector('.indice-pie');
    if (!nombre || !pie) return;

    const expedientes = [
        [2, 'LAS SEÑALES IGNORADAS'],
        [3, 'UN PASADO OLVIDADO'],
        [4, 'LA ARTISTA DESAPARECIDA'],
        [5, 'LO QUE LOS UNÍA'],
        [6, 'DETRÁS DEL PROYECTO'],
        [7, 'LA ÚLTIMA PIEZA']
    ];
    const enlaces = expedientes.map(([numero, titulo]) => {
        const codigo = String(numero).padStart(3, '0');
        const enlace = document.createElement('a');
        enlace.href = `./expediente${codigo}.html`;
        enlace.className = 'archivo-indice';
        enlace.style.textDecoration = 'none';
        enlace.textContent = `▣  ${codigo} — ${titulo} →`;
        enlace.setAttribute('aria-label', `Abrir expediente ${codigo}: ${titulo}`);
        enlace.hidden = true;
        enlace.style.display = 'none';
        pie.insertBefore(enlace, pie.querySelector('.archivo-bloqueado'));
        return { numero, enlace };
    });

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

    function actualizar() {
        const { resueltos, recuperados } = actualizarEstadoIndice();
        // Solo se muestran accesos que el jugador ya ha desbloqueado.
        for (const { numero, enlace } of enlaces) {
            const abierto = numero <= recuperados;
            enlace.hidden = !abierto;
            enlace.style.display = abierto ? 'flex' : 'none';
        }

        // Al regresar al expediente 001, conserva el progreso alcanzado.
        document.querySelectorAll('.investigacion-topbar progress, .progreso-panel progress').forEach(p => {
            p.value = resueltos;
        });
        const general = document.querySelector('.avance-general-fila strong');
        if (general) general.textContent = `${resueltos} / 7`;
        const texto = document.querySelector('.contador-progreso');
        if (texto) texto.textContent = `${resueltos} / 7 ACERTIJOS`;
        const confianza = document.querySelector('.confianza-panel progress');
        if (confianza) confianza.value = resueltos;
        if (resueltos >= 2) {
            const estadoConfianza = document.querySelector('.confianza-panel > p');
            if (estadoConfianza) estadoConfianza.textContent = 'CONFIANZA EN DESARROLLO (DEMO)';
        }
    }

    // El manejador del acertijo 01 guarda el resultado antes de este listener.
    document.getElementById('form-acertijo01')?.addEventListener('submit', actualizar);
    window.addEventListener('pageshow', actualizar);
    actualizar();
});
