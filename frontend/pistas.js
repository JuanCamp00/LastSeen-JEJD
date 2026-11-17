/* LAST SEEN · Pistas oficiales de los acertijos 001–007.
   Fuente: datos_iniciales.sql (tabla pista, orden 1).
   Interfaz de demostración: las pistas 02–07 se habilitan tras el primer error;
   la API final decidirá la disponibilidad definitiva.
*/
document.addEventListener('DOMContentLoaded', () => {
    const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
    const etiqueta = document.querySelector('.chip-expediente')?.textContent || '';
    const coincidencia = etiqueta.match(/EXPEDIENTE\s*(\d{3})/i);
    const zona = document.querySelector('.zona-acertijo');
    if (!nombre || !coincidencia || !zona) return;
    const numero = Number(coincidencia[1]);
    const codigo = String(numero).padStart(3, '0');
    const version = numero === 1 ? 'v2' : 'v1';
    const id = encodeURIComponent(nombre);
    const claveResuelto = `lastSeen.demo.expediente${codigo}.${version}.${id}.resuelto`;
    const claveError = `lastSeen.demo.pistas.expediente${codigo}.${id}.intentoIncorrecto`;
    const pista = PISTAS_LASTSEEN[numero];
    if (!pista) return;

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-pista-lastseen';
    boton.textContent = '◇  CONSULTAR PISTA DEL EXPEDIENTE';
    boton.setAttribute('aria-haspopup', 'dialog');
    const cierre = zona.querySelector('#cierre-expediente07');
    if (cierre) zona.insertBefore(boton, cierre);
    else zona.appendChild(boton);

    const dialogo = document.createElement('dialog');
    dialogo.className = 'dialogo-prueba dialogo-pista-lastseen';
    dialogo.setAttribute('aria-labelledby', 'titulo-pista-lastseen');
    dialogo.innerHTML = `
        <div class="dialogo-cabecera">
            <p class="microtitulo-investigacion">PISTA / EXPEDIENTE ${codigo}</p>
            <button class="cerrar-dialogo" type="button" aria-label="Cerrar pista">✕</button>
        </div>
        <h2 id="titulo-pista-lastseen">AYUDA PARA EL ACERTIJO ${codigo}</h2>
        <p class="texto-pista-lastseen" id="texto-pista-lastseen"></p>
        <p class="aviso-pista-lastseen" id="aviso-pista-lastseen" role="status"></p>
        <p class="dialogo-pie">Pista oficial del expediente. Disponibilidad provisional en el frontend.</p>`;
    document.body.appendChild(dialogo);
    const cerrar = dialogo.querySelector('.cerrar-dialogo');
    const texto = dialogo.querySelector('#texto-pista-lastseen');
    const aviso = dialogo.querySelector('#aviso-pista-lastseen');

    const resuelto = () => sessionStorage.getItem(claveResuelto) === 'true';
    const disponible = () => pista.desdeInicio || resuelto() || sessionStorage.getItem(claveError) === 'true';
    function actualizar() {
        const habilitada = disponible();
        boton.textContent = habilitada ? '◇  CONSULTAR PISTA DEL EXPEDIENTE' : '◇  PISTA AÚN BLOQUEADA';
        boton.title = habilitada
            ? 'Abrir la pista de este acertijo'
            : 'Se desbloquea tras un intento incorrecto de este acertijo';
        texto.hidden = !habilitada;
        texto.textContent = habilitada ? pista.contenido : '';
        aviso.textContent = habilitada
            ? 'ARCHIVO DE AYUDA DISPONIBLE'
            : 'La pista se desbloqueará después de tu primer intento incorrecto.';
    }
    function abrir() {
        actualizar();
        dialogo.showModal();
    }
    boton.addEventListener('click', abrir);
    cerrar.addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', evento => {
        if (evento.target === dialogo) dialogo.close();
    });

    // La barra inferior PISTAS existe en la mesa del expediente 001.
    // Se reutiliza sin cambiar sus estilos ni el resto de la navegación.
    const pestañaPistas = Array.from(document.querySelectorAll('.pestanas-investigacion button'))
        .find(elemento => /PISTAS/.test(elemento.textContent));
    if (pestañaPistas) {
        pestañaPistas.disabled = false;
        pestañaPistas.title = 'Consultar la pista del expediente actual';
        pestañaPistas.addEventListener('click', abrir);
    }

    const formulario = document.getElementById(`form-acertijo${String(numero).padStart(2, '0')}`);
    formulario?.addEventListener('submit', () => {
        // El controlador del acertijo se registró antes y ya validó el resultado.
        if (!resuelto()) {
            const respondido = Array.from(formulario.querySelectorAll('input,textarea,select'))
                .some(campo => {
                    if (campo.type === 'radio' || campo.type === 'checkbox') return campo.checked;
                    return campo.type !== 'hidden' && typeof campo.value === 'string' && campo.value.trim() !== '';
                });
            if (respondido) sessionStorage.setItem(claveError, 'true');
        }
        actualizar();
    });
    window.addEventListener('pageshow', actualizar);
    actualizar();
});

const PISTAS_LASTSEEN = Object.freeze({
    1: { contenido: "Revisa la presentación pública del equipo. Cuenta a las personas que lo integraban, no las áreas de trabajo.", desdeInicio: true },
    2: { contenido: "Presta atención a quién considera que debe asumir las decisiones definitivas, en lugar de buscar un acuerdo entre todos.", desdeInicio: false },
    3: { contenido: "Revisa el comunicado de cierre y presta atención a las razones que menciona el equipo para separarse.", desdeInicio: false },
    4: { contenido: "Compara las publicaciones anteriores al anuncio con la última publicación que quedó archivada.", desdeInicio: false },
    5: { contenido: "No te limites a revisar sus responsabilidades profesionales. Presta atención al fragmento de la nota personal.", desdeInicio: false },
    6: { contenido: "Compara las intervenciones de ambos desarrolladores durante la reunión y observa qué problema nunca consiguieron resolver.", desdeInicio: false },
    7: { contenido: "Compara la última actividad del backend con los registros posteriores. Recuerda que una ausencia de registros no demuestra por sí sola qué ocurrió.", desdeInicio: false }
});
