/* LAST SEEN · Informe de cierre (solo frontend).
   El informe solo es visible para el investigador que resolvió el caso 007.
   No llama a la API, no modifica acertijos ni persiste datos nuevos. */
(() => {
    'use strict';
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

        document.getElementById('imprimir-informe').addEventListener('click', () => {
            window.print();
        });
    });
})();
