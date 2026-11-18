/* LAST SEEN · Informe de cierre conectado a PostgreSQL.
   Muestra el tiempo persistido de la partida y habilita las tres acciones finales. */
(() => {
    'use strict';

    const API_BASE_URL = 'http://localhost:3000/api';

    function formatearDuracion(segundos) {
        const total = Math.max(0, Math.floor(Number(segundos)));
        const horas = Math.floor(total / 3600);
        const minutos = Math.floor((total % 3600) / 60);
        const segundosRestantes = total % 60;
        return [horas, minutos, segundosRestantes]
            .map(valor => String(valor).padStart(2, '0'))
            .join(':');
    }

    async function cargarTiempoTotal(idPartida, elemento) {
        if (!elemento) return;
        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            elemento.textContent = 'NO DISPONIBLE';
            elemento.title = 'No se encontró el identificador de la partida en esta sesión.';
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/partidas/${idPartida}`, {
                headers: { Accept: 'application/json' }
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data?.mensaje || `No se pudo consultar los datos de la partida (HTTP ${response.status}).`);
            }

            const segundos = data?.partida?.tiempo_total_segundos;
            if (segundos === null || segundos === undefined || segundos === '') {
                throw new Error('La partida no tiene un tiempo total registrado.');
            }

            elemento.textContent = formatearDuracion(segundos);
            elemento.title = `${Number(segundos)} segundos registrados en PostgreSQL.`;
            elemento.setAttribute('aria-label', `Tiempo total: ${elemento.textContent}`);
        } catch (error) {
            elemento.textContent = 'NO DISPONIBLE';
            elemento.title = error.message || 'No fue posible recuperar el tiempo de la partida.';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
        if (!nombre) {
            window.location.replace('./index.html');
            return;
        }

        const id = encodeURIComponent(nombre);
        const claveFinal = `lastSeen.demo.expediente007.v1.${id}.resuelto`;
        if (sessionStorage.getItem(claveFinal) !== 'true') {
            window.location.replace('./investigacion.html');
            return;
        }

        document.getElementById('nombre-investigador-final').textContent = nombre;
        document.body.classList.add('informe-autorizado');

        // El backend guarda el valor final al resolver el acertijo 007.
        const idPartida = Number(sessionStorage.getItem('lastSeen.idPartida'));
        cargarTiempoTotal(idPartida, document.getElementById('tiempo-investigacion-final'));

        const revisarUltimo = document.getElementById('revisar-ultimo-expediente');
        revisarUltimo?.addEventListener('click', evento => {
            evento.preventDefault();
            window.location.assign('./expediente007.html');
        });

        const volverIntroduccion = document.getElementById('volver-a-introduccion');
        volverIntroduccion?.addEventListener('click', evento => {
            evento.preventDefault();
            window.location.assign('./introduccion.html');
        });

        document.getElementById('imprimir-informe')?.addEventListener('click', evento => {
            evento.preventDefault();
            window.print();
        });
    });
})();
