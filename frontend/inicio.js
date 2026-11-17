/* LAST SEEN · Panel principal.
   Los indicadores son demostraciones locales; el backend los sustituirá
   por información de la API cuando se integre PostgreSQL. */
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    if (!nombre) {
        window.location.replace('./index.html');
        return;
    }

    document.getElementById('nombre-perfil').textContent = nombre;
    const id = encodeURIComponent(nombre);
    let resueltos = 0;
    for (let numero = 1; numero <= 7; numero++) {
        const codigo = String(numero).padStart(3, '0');
        const version = numero === 1 ? 'v2' : 'v1';
        const clave = `lastSeen.demo.expediente${codigo}.${version}.${id}.resuelto`;
        if (sessionStorage.getItem(clave) !== 'true') break;
        resueltos++;
    }

    let pistasDisponibles = 1; // La primera pista está disponible desde el inicio.
    for (let numero = 2; numero <= 7; numero++) {
        const codigo = String(numero).padStart(3, '0');
        const intento = `lastSeen.demo.pistas.expediente${codigo}.${id}.intentoIncorrecto`;
        if (numero <= resueltos || sessionStorage.getItem(intento) === 'true') {
            pistasDisponibles++;
        }
    }

    const terminado = resueltos === 7;
    const proximo = String(Math.min(resueltos + 1, 7)).padStart(3, '0');
    const estado = document.querySelector('.lateral-estado');
    if (estado) {
        estado.textContent = terminado ? '007 / CASO COMPLETADO'
            : resueltos ? `${proximo} / EN INVESTIGACIÓN` : '001 / SIN INICIAR';
    }

    const estadisticas = document.querySelectorAll('.progreso dl dd');
    if (estadisticas.length >= 3) {
        estadisticas[0].textContent = terminado ? '1' : '0';
        estadisticas[1].textContent = String(resueltos);
        estadisticas[2].textContent = String(pistasDisponibles);
    }
    const barra = document.getElementById('barra-confianza');
    if (barra) {
        barra.max = 7;
        barra.value = resueltos;
        barra.textContent = `${resueltos} de 7 acertijos`;
    }

    const recientes = document.querySelector('.partidas-recientes');
    const parrafos = recientes?.querySelectorAll('p');
    if (parrafos?.length >= 2 && resueltos > 0) {
        parrafos[0].textContent = terminado
            ? 'Investigación completada · 7 / 7 acertijos.'
            : `Investigación en curso · ${resueltos} / 7 acertijos.`;
        parrafos[1].textContent = 'Progreso provisional guardado en esta pestaña del navegador.';
    }

    const portada = document.querySelector('.boton-investigacion');
    if (portada && resueltos > 0) {
        const primerTexto = Array.from(portada.childNodes).find(nodo => nodo.nodeType === Node.TEXT_NODE);
        if (primerTexto) primerTexto.textContent = terminado
            ? '▶   REVISAR INVESTIGACIÓN '
            : '▶   CONTINUAR INVESTIGACIÓN ';
    }

    const actividad = document.querySelector('.actividad-reciente');
    if (actividad && resueltos > 0) {
        const p = actividad.querySelector('p');
        const detalle = actividad.querySelector('small');
        if (p) p.textContent = terminado ? 'INVESTIGACIÓN COMPLETADA'
            : `ÚLTIMO AVANCE · EXPEDIENTE ${String(resueltos).padStart(3, '0')}`;
        if (detalle) detalle.textContent = 'Registro provisional de esta sesión.';
    }

    document.getElementById('cerrar-sesion').addEventListener('click', () => {
        sessionStorage.removeItem('lastSeen.nombreInvestigador');
        window.location.replace('./index.html');
    });
});
