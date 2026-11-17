/* LAST SEEN · Archivo testimonial de la artista (frontend de demostración).
   Evidencia literal y observaciones tomadas de:
   - documentos/expediente_004/archivo_publicaciones_artista.txt
   - documentos/expediente_005/registro_colaboracion.txt
   - documentos/expediente_006/registro_de_conflictos.txt
   - documentos/expediente_007/ultimo_registro_recuperado.txt

   Los documentos NO contienen testimonios directos nuevos en los casos 005 y 006;
   esos dos niveles muestran contexto archivado, no declaraciones atribuidas a ella.
   No hay validación por backend ni se guardan nuevos datos personales.
*/
(() => {
    'use strict';

    const etapas = Object.freeze([
        {
            desde: 4,
            titulo: 'PUBLICACIÓN DE LA ARTISTA',
            tipo: 'PUBLICACIÓN PÚBLICA · NO ES ENTREVISTA',
            contenido: '«Gracias a todos los que se han preocupado por mí. Por ahora prefiero mantener mis trabajos en privado. Espero que puedan entenderlo».',
            cita: true,
            fuente: 'Archivo de publicaciones de la artista · Expediente 004'
        },
        {
            desde: 5,
            titulo: 'COLABORACIÓN DOCUMENTADA',
            tipo: 'OBSERVACIÓN DEL ARCHIVO · NO ES TESTIMONIO',
            contenido: 'Los registros indican que la artista y el desarrollador frontend trabajaban estrechamente en las decisiones visuales. El documento no explica por qué dejaron de trabajar juntos.',
            cita: false,
            fuente: 'Registro de colaboración creativa · Expediente 005'
        },
        {
            desde: 6,
            titulo: 'CONTEXTO DE LOS DESACUERDOS',
            tipo: 'NOTAS INTERNAS · NO ES TESTIMONIO',
            contenido: 'Las reuniones documentan desacuerdos técnicos entre los dos desarrolladores y dificultades crecientes de coordinación. No se conserva aquí una declaración adicional de la artista.',
            cita: false,
            fuente: 'Registro de reuniones y desacuerdos · Expediente 006'
        },
        {
            desde: 7,
            titulo: 'DECLARACIÓN RECUPERADA DE LA ARTISTA',
            tipo: 'TESTIMONIO DIRECTO · ARCHIVO 007-A',
            contenido: '«Después de aquella última reunión dejé de tener noticias de ambos.\n\nPregunté qué había sucedido, pero recibí respuestas diferentes. Ninguna me convenció del todo.\n\nDurante mucho tiempo pensé que simplemente habíamos terminado mal. Ahora ni siquiera sé si alguna vez entendí lo que estaba ocurriendo».',
            cita: true,
            fuente: 'Últimos registros del proyecto · Expediente 007'
        }
    ]);

    function contarResueltos(nombre) {
        const id = encodeURIComponent(nombre);
        let total = 0;
        for (let numero = 1; numero <= 7; numero++) {
            const codigo = String(numero).padStart(3, '0');
            const version = numero === 1 ? 'v2' : 'v1';
            const clave = `lastSeen.demo.expediente${codigo}.${version}.${id}.resuelto`;
            if (sessionStorage.getItem(clave) !== 'true') break;
            total++;
        }
        return total;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const panel = document.querySelector('.confianza-panel');
        const tarjeta = panel?.querySelector('.testimonio-bloqueado');
        const nombre = sessionStorage.getItem('lastSeen.nombreInvestigador')?.trim();
        if (!panel || !tarjeta || !nombre) return;

        const estado = panel.querySelector(':scope > p');
        const indicador = panel.querySelector('progress');
        const titular = tarjeta.querySelector('strong') || document.createElement('strong');
        const descripcion = tarjeta.querySelector('p') || document.createElement('p');
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'testimonios-acceso';
        boton.textContent = '◉  ABRIR ARCHIVO DE LA ARTISTA';
        boton.setAttribute('aria-haspopup', 'dialog');
        tarjeta.replaceChildren(titular, descripcion, boton);

        const dialogo = document.createElement('dialog');
        dialogo.className = 'dialogo-prueba dialogo-testimonios';
        dialogo.setAttribute('aria-labelledby', 'titulo-testimonios-artista');
        dialogo.innerHTML = `
            <div class="dialogo-cabecera">
                <p class="microtitulo-investigacion">LAST SEEN / ARCHIVO DE LA ARTISTA</p>
                <button type="button" class="cerrar-dialogo" aria-label="Cerrar archivo de la artista">✕</button>
            </div>
            <h2 id="titulo-testimonios-artista">RASTROS DE LA ARTISTA</h2>
            <p class="testimonios-intro">Publicaciones, contexto documental y una declaración recuperada. Solo la última etapa es un testimonio directo posterior a los hechos.</p>
            <p class="testimonios-contador" role="status" aria-live="polite"></p>
            <div class="testimonios-lista"></div>
            <p class="testimonios-advertencia">El archivo no demuestra qué ocurrió con el desarrollador backend. Desbloqueos y progreso simulados en este navegador.</p>
        `;
        document.body.appendChild(dialogo);
        const lista = dialogo.querySelector('.testimonios-lista');
        const contador = dialogo.querySelector('.testimonios-contador');

        function crearEtapa(etapa, avance) {
            const disponible = avance >= etapa.desde;
            const articulo = document.createElement('article');
            articulo.className = `testimonios-etapa ${disponible ? 'testimonios-etapa--abierta' : 'testimonios-etapa--cerrada'}`;
            const cabecera = document.createElement('div');
            cabecera.className = 'testimonios-etapa-cabecera';
            const numero = document.createElement('span');
            numero.className = 'testimonios-etapa-numero';
            numero.textContent = String(etapa.desde).padStart(2, '0');
            const etiqueta = document.createElement('span');
            etiqueta.className = 'testimonios-etapa-estado';
            etiqueta.textContent = disponible ? '▣ RECUPERADO' : `◇ REQUIERE ${etapa.desde} / 7`;
            cabecera.append(numero, etiqueta);
            const titulo = document.createElement('h3');
            titulo.textContent = disponible ? etapa.titulo : 'FRAGMENTO RESERVADO';
            articulo.append(cabecera, titulo);
            if (disponible) {
                const tipo = document.createElement('p');
                tipo.className = 'testimonios-tipo';
                tipo.textContent = etapa.tipo;
                const contenido = document.createElement(etapa.cita ? 'blockquote' : 'p');
                contenido.className = etapa.cita ? 'testimonios-cita' : 'testimonios-contenido';
                contenido.textContent = etapa.contenido;
                const fuente = document.createElement('p');
                fuente.className = 'testimonios-fuente';
                fuente.textContent = `FUENTE: ${etapa.fuente}`;
                articulo.append(tipo, contenido, fuente);
            } else {
                const pendiente = document.createElement('p');
                pendiente.className = 'testimonios-pendiente';
                pendiente.textContent = 'Este fragmento aparecerá cuando avances en la investigación.';
                articulo.appendChild(pendiente);
            }
            return articulo;
        }

        function actualizar() {
            const avance = contarResueltos(nombre);
            const cantidad = etapas.filter(etapa => avance >= etapa.desde).length;
            if (indicador) {
                indicador.value = avance;
                indicador.max = 7;
                indicador.setAttribute('aria-label', 'Indicador narrativo provisional de la artista');
            }
            if (estado) {
                estado.textContent = avance >= 7
                    ? 'DECLARACIÓN RECUPERADA · INDICADOR SIMBÓLICO'
                    : avance >= 4
                        ? `ARCHIVOS DE LA ARTISTA · ${cantidad} / 4 RECUPERADOS`
                        : 'SIN DECLARACIÓN DISPONIBLE · INDICADOR SIMBÓLICO';
            }
            if (avance >= 7) {
                titular.textContent = '▣  DECLARACIÓN RECUPERADA';
                descripcion.textContent = 'La versión archivada de la artista ya puede consultarse junto con los registros anteriores.';
            } else if (avance >= 4) {
                titular.textContent = '▣  RASTROS DE LA ARTISTA';
                descripcion.textContent = `${cantidad} de 4 fragmentos disponibles. Sigue investigando para acceder a su declaración.`;
            } else {
                titular.textContent = '◇  ARCHIVO TESTIMONIAL RESERVADO';
                descripcion.textContent = 'Los primeros registros de la artista se habilitan al completar el Expediente 004.';
            }
            contador.textContent = `PROGRESO DEL CASO: ${avance} / 7 · FRAGMENTOS RECUPERADOS: ${cantidad} / 4`;
            lista.replaceChildren(...etapas.map(etapa => crearEtapa(etapa, avance)));
        }

        function abrir() {
            actualizar();
            if (!dialogo.open) dialogo.showModal();
        }
        boton.addEventListener('click', abrir);
        dialogo.querySelector('.cerrar-dialogo').addEventListener('click', () => dialogo.close());
        dialogo.addEventListener('click', evento => {
            if (evento.target === dialogo) dialogo.close();
        });

        // La barra inferior solo aparece en la mesa del Expediente 001.
        const pestaña = [...document.querySelectorAll('.pestanas-investigacion button')]
            .find(elemento => /TESTIMONIOS/.test(elemento.textContent));
        if (pestaña) {
            pestaña.disabled = false;
            pestaña.title = 'Consultar el archivo de la artista';
            pestaña.addEventListener('click', abrir);
        }

        // Los controladores existentes guardan la respuesta durante el evento submit.
        // La microtarea lee el resultado final sin editar su lógica de validación.
        document.addEventListener('submit', () => queueMicrotask(actualizar));
        window.addEventListener('pageshow', actualizar);
        window.addEventListener('focus', actualizar);
        actualizar();
    });
})();
