
const Acertijo = require('../../dominio/entidades/Acertijo');

const ValidacionTexto = require('../../dominio/estrategias/ValidacionTexto');
const ValidacionSeleccion = require('../../dominio/estrategias/ValidacionSeleccion');

const AcertijoPendiente = require('../../dominio/estados/AcertijoPendiente');

const GestorDesbloqueos = require('../../dominio/observadores/GestorDesbloqueos');


class AcertijoServicio {

    constructor({
        poolConexion,
        AcertijoRepositorio,
        IntentoRepositorio,
        ProgresoRepositorio,
        ContenidoRepositorio,
        PistaRepositorio
    }) {

        if (!poolConexion || typeof poolConexion.connect !== 'function') {
            throw new Error('Se requiere un pool de conexiones PostgreSQL.');
        }

        const repositorios = {
            AcertijoRepositorio,
            IntentoRepositorio,
            ProgresoRepositorio,
            ContenidoRepositorio,
            PistaRepositorio
        };

        for (const [nombre, Repositorio] of Object.entries(repositorios)) {
            if (typeof Repositorio !== 'function') {
                throw new Error(
                    `No se proporcionó correctamente ${nombre}.`
                );
            }
        }

        this.pool = poolConexion;
        this.AcertijoRepositorio = AcertijoRepositorio;
        this.IntentoRepositorio = IntentoRepositorio;
        this.ProgresoRepositorio = ProgresoRepositorio;
        this.ContenidoRepositorio = ContenidoRepositorio;
        this.PistaRepositorio = PistaRepositorio;
    }


    
    // RESOLVER UN ACERTIJO
   

    async resolverAcertijo({
        idPartida,
        idAcertijo,
        respuestaTexto = null,
        idOpcionSeleccionada = null
    } = {}) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo no es válido.'
            );
        }

        const cliente = await this.pool.connect();

        let transaccionIniciada = false;

        try {

            // 1. INICIAR TRANSACCIÓN
         

            await cliente.query('BEGIN');
            transaccionIniciada = true;


         
            // 2. CREAR REPOSITORIOS CON EL CLIENTE
        

            const acertijoRepositorio =
                new this.AcertijoRepositorio(cliente);

            const intentoRepositorio =
                new this.IntentoRepositorio(cliente);

            const progresoRepositorio =
                new this.ProgresoRepositorio(cliente);

            const contenidoRepositorio =
                new this.ContenidoRepositorio(cliente);

            const pistaRepositorio =
                new this.PistaRepositorio(cliente);


        
            // 3. COMPROBAR EL PROGRESO DE LA PARTIDA
         

            const progreso =
                await progresoRepositorio.buscarPorPartida(idPartida);

            if (!progreso) {
                throw new Error(
                    'La partida no tiene un progreso registrado.'
                );
            }

            if (progreso.id_acertijo_actual !== idAcertijo) {
                throw new Error(
                    'Este acertijo no corresponde al progreso actual de la partida.'
                );
            }


            // 4. COMPROBAR EL ESTADO DEL ACERTIJO
         
            const estadoActual =
                await acertijoRepositorio.buscarEstadoEnPartida(
                    idPartida,
                    idAcertijo
                );

            if (!estadoActual) {
                throw new Error(
                    'El acertijo no está asociado a esta partida.'
                );
            }

            if (estadoActual.estado === 'RESUELTO') {
                throw new Error(
                    'Este acertijo ya fue resuelto.'
                );
            }

            if (estadoActual.estado !== 'PENDIENTE') {
                throw new Error(
                    'El estado actual del acertijo no es válido.'
                );
            }


    
            // 5. OBTENER LA INFORMACIÓN DEL ACERTIJO
      

            const datosAcertijo =
                await acertijoRepositorio.buscarPorId(idAcertijo);

            if (!datosAcertijo) {
                throw new Error(
                    'No se encontró el acertijo solicitado.'
                );
            }


            // 6. SELECCIONAR LA ESTRATEGIA
        

            let estrategia;
            let respuestaCorrecta;
            let opcionSeleccionadaFinal = null;
            let respuestaTextoFinal = null;

            const tieneTexto =
                typeof respuestaTexto === 'string' &&
                respuestaTexto.trim().length > 0;

            const tieneOpcion =
                Number.isInteger(idOpcionSeleccionada) &&
                idOpcionSeleccionada > 0;


            if (datosAcertijo.tipo_validacion === 'TEXTO') {

                if (tieneOpcion || !tieneTexto) {
                    throw new Error(
                        'Este acertijo requiere una respuesta de texto.'
                    );
                }

                estrategia = new ValidacionTexto();

                respuestaCorrecta =
                    datosAcertijo.respuesta_correcta_texto;

                respuestaTextoFinal = respuestaTexto.trim();

            } else if (
                datosAcertijo.tipo_validacion === 'SELECCION'
            ) {

                if (tieneTexto || !tieneOpcion) {
                    throw new Error(
                        'Este acertijo requiere seleccionar una opción.'
                    );
                }

                estrategia = new ValidacionSeleccion();

                const opciones =
                    await acertijoRepositorio.obtenerOpcionesPorAcertijo(
                        idAcertijo
                    );

                const opcionValida = opciones.some(
                    opcion => opcion.id_opcion === idOpcionSeleccionada
                );

                if (!opcionValida) {
                    throw new Error(
                        'La opción seleccionada no pertenece a este acertijo.'
                    );
                }

                const opcionCorrecta =
                    await acertijoRepositorio.obtenerOpcionCorrecta(
                        idAcertijo
                    );

                if (!opcionCorrecta) {
                    throw new Error(
                        'El acertijo no tiene una opción correcta configurada.'
                    );
                }

                respuestaCorrecta = opcionCorrecta.id_opcion;
                opcionSeleccionadaFinal = idOpcionSeleccionada;

            } else {

                throw new Error(
                    'El tipo de validación del acertijo no es válido.'
                );

            }


            // 7. VALIDAR LA RESPUESTA
          

            const esCorrecta = estrategia.validar(
                datosAcertijo.tipo_validacion === 'TEXTO'
                    ? respuestaTextoFinal
                    : opcionSeleccionadaFinal,
                respuestaCorrecta
            );

            const resultado = esCorrecta
                ? 'CORRECTO'
                : 'INCORRECTO';


      
            // 8. REGISTRAR EL INTENTO
         

            const intento = await intentoRepositorio.guardar({

                idPartida,
                idAcertijo,
                respuestaTexto: respuestaTextoFinal,
                idOpcionSeleccionada: opcionSeleccionadaFinal,
                resultado

            });


         
            // 9. SI ES INCORRECTA, CONSERVAR
            // EL ESTADO Y EL PROGRESO
     

            if (!esCorrecta) {

                await cliente.query('COMMIT');
                transaccionIniciada = false;

                return {
                    correcto: false,
                    intento,
                    mensaje: 'La respuesta no es correcta. Puedes volver a intentarlo.'
                };
            }


            // 10. APLICAR EL PATRÓN STATE
          

            const estadoPendiente = new AcertijoPendiente();

            const estadoResuelto = estadoPendiente.resolver();

            const estadoGuardado =
                await acertijoRepositorio.actualizarEstado(
                    idPartida,
                    idAcertijo,
                    estadoResuelto.obtenerNombre()
                );

            // 11. CALCULAR EL SIGUIENTE ACERTIJO
        

            const acertijos =
                await acertijoRepositorio.obtenerAcertijos();

            const siguienteAcertijo = acertijos.find(
                acertijo => acertijo.orden === datosAcertijo.orden + 1
            );

            const siguienteAcertijoId = siguienteAcertijo
                ? siguienteAcertijo.id_acertijo
                : null;


            
            // 12. ACTUALIZAR EL PROGRESO
       
            const nuevoProgreso =
                await progresoRepositorio.guardar({
                    idPartida,
                    idAcertijoActual: siguienteAcertijoId
                });


            // 13. APLICAR EL PATRÓN OBSERVER
           
            const acertijo = new Acertijo({
                idAcertijo: datosAcertijo.id_acertijo,
                pregunta: datosAcertijo.pregunta,
                orden: datosAcertijo.orden,
                tipoValidacion: datosAcertijo.tipo_validacion,
                respuestaCorrectaTexto:
                    datosAcertijo.respuesta_correcta_texto
            });

            const gestorDesbloqueos = new GestorDesbloqueos({

                contenidoRepositorio,
                pistaRepositorio,
                acertijoRepositorio

            });

            acertijo.agregarObservador(gestorDesbloqueos);

            await acertijo.notificarResolucion(idPartida);


        
            // 14. CONSULTAR LOS CONTENIDOS Y PISTAS
            // DISPONIBLES DESPUÉS DEL DESBLOQUEO
          
            const contenidosDisponibles =
                await contenidoRepositorio.obtenerPorPartida(idPartida);

            const pistasDisponibles =
                await pistaRepositorio.obtenerDisponiblesPorPartida(
                    idPartida
                );


            // 15. CONFIRMAR TRANSACCIÓN
           
            await cliente.query('COMMIT');
            transaccionIniciada = false;


       
            // 16. DEVOLVER EL RESULTADO
           

            return {

                correcto: true,
                intento,

                estadoAcertijo: estadoGuardado.estado,

                progreso: nuevoProgreso,

                siguienteAcertijoId,

                contenidosDisponibles,

                pistasDisponibles,

                mensaje: '¡Acertijo resuelto! Has desbloqueado nuevas evidencias.'

            };


        } catch (error) {

            if (transaccionIniciada) {
                await cliente.query('ROLLBACK').catch(() => {});
            }

            throw error;

        } finally {

            cliente.release();

        }

    }

}


// Exportar el servicio
module.exports = AcertijoServicio;
