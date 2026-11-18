/* LAST SEEN · Disponibilidad de pistas controlada por la API.
   Una pista solo se habilita cuando PostgreSQL registra un intento incorrecto
   del acertijo actual de la partida activa. */
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const etiqueta = document.querySelector('.chip-expediente')?.textContent || '';
        const coincidencia = etiqueta.match(/EXPEDIENTE\s*(\d{3})/i);
        const zona = document.querySelector('.zona-acertijo');
        if (!coincidencia || !zona) return;

        const orden = Number(coincidencia[1]);
        let boton = zona.querySelector('.boton-pista-lastseen');
        if (!boton) {
            boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'boton-pista-lastseen';
            const cierre = zona.querySelector('#cierre-expediente07');
            if (cierre) zona.insertBefore(boton, cierre);
            else zona.appendChild(boton);
        }

        const pestaña = Array.from(document.querySelectorAll('.pestanas-investigacion button'))
            .find(elemento => /PISTAS/.test(elemento.textContent || ''));

        function actualizar(disponible) {
            const habilitada = Boolean(disponible);
            boton.disabled = !habilitada;
            boton.textContent = habilitada
                ? '◇  CONSULTAR PISTA DEL EXPEDIENTE'
                : '◇  PISTA AÚN BLOQUEADA';
            boton.title = habilitada
                ? 'Consultar la pista desbloqueada para este acertijo'
                : 'La pista se desbloquea después de un intento incorrecto';
            boton.setAttribute('aria-disabled', String(!habilitada));

            if (pestaña) {
                pestaña.disabled = !habilitada;
                pestaña.title = habilitada
                    ? 'Consultar la pista desbloqueada'
                    : 'Se habilita después de un intento incorrecto';
            }
        }

        window.addEventListener('lastSeen:pistaDisponibilidad', evento => {
            if (Number(evento.detail?.orden) !== orden) return;
            actualizar(evento.detail?.disponible);
        });

        // Estado inicial cerrado. La API lo habilitará solo si el servidor confirma
        // un intento INCORRECTO del acertijo de esta partida.
        actualizar(false);
    });
})();
