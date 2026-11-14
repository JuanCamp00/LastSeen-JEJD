
const Acertijo = require('../../dominio/entidades/Acertijo');
const Intento = require('../../dominio/entidades/Intento');
const ValidacionTexto = require('../../dominio/estrategias/ValidacionTexto');
const ValidacionSeleccion = require('../../dominio/estrategias/ValidacionSeleccion');
const Progreso = require('../../dominio/entidades/Progreso');

const AcertijoPendiente = require('../../dominio/estados/AcertijoPendiente');

const GestorDesbloqueos = require('../../dominio/observadores/GestorDesbloqueos');

const ErrorAplicacion = require('../../infraestructura/errores/ErrorAplicacion');




class AcertijoServicio {

    constructor({
        poolConexion,
        PartidaRepositorio,
        AcertijoRepositorio,
        IntentoRepositorio,
        ProgresoRepositorio,
        ContenidoRepositorio,
        PistaRepositorio
    }) {

        if (!poolConexion || typeof poolConexion.connect !== 'function') {
            throw new ErrorAplicacion(
    'se requiere un pool de conexión a la base de datos.',
    {
        statusCode: 500,
        code: 'POOL_CONEXION_NO_PROPORCIONADO'
    }
);
        }

        const repositorios = {
            PartidaRepositorio,
            AcertijoRepositorio,
            IntentoRepositorio,
            ProgresoRepositorio,
            ContenidoRepositorio,
            PistaRepositorio
        };

        for (const [nombre, Repositorio] of Object.entries(repositorios)) {
            if (typeof Repositorio !== 'function') {
                throw new ErrorAplicacion(
                    `No se proporcionó correctamente ${nombre}.`,

                       {
        statusCode: 500,
        code: 'REPOSITORIO_NO_PROPORCIONADO'
    }

                );
            }
        }

        this.pool = poolConexion;
        this.PartidaRepositorio = PartidaRepositorio;
        this.AcertijoRepositorio = AcertijoRepositorio;
        this.IntentoRepositorio = IntentoRepositorio;
        this.ProgresoRepositorio = ProgresoRepositorio;
        this.ContenidoRepositorio = ContenidoRepositorio;
        this.PistaRepositorio = PistaRepositorio;
    }

    // CONSULTAR EL ACERTIJO ACTUAL DE UNA PARTIDA

async obtenerAcertijoActual(idPartida) {

    if (!Number.isInteger(idPartida) || idPartida <= 0) {
          throw new ErrorAplicacion(
    'El identificador de la partida no es válido.',
    {
        statusCode: 400,
        code: 'PARTIDA_NO_VALIDA'
    }
);
    }

    // Crear los repositorios
    const partidaRepositorio =
        new this.PartidaRepositorio(this.pool);

    const progresoRepositorio =
        new this.ProgresoRepositorio(this.pool);

    const acertijoRepositorio =
        new this.AcertijoRepositorio(this.pool);

    // Comprobar que la partida exista
    const partida =
        await partidaRepositorio.buscarPorId(idPartida);

    if (!partida) {
        throw new ErrorAplicacion(
    'No se encontró la partida.',
    {
        statusCode: 404,
        code: 'PARTIDA_NO_ENCONTRADA'
    }
);
    }

    // Consultar el progreso
    const progreso =
        await progresoRepositorio.buscarPorPartida(idPartida);

    if (!progreso) {
        throw new ErrorAplicacion(
    'El progreso de la partida no se encontró.',
    {
        statusCode: 409,
        code: 'PROGRESO_NO_DISPONIBLE'
    }
);
    }

    // Comprobar si la investigación terminó
    if (progreso.id_acertijo_actual === null) {

        if (partida.estado !== 'FINALIZADA') {
           throw new ErrorAplicacion(
    'El progreso de la partida es inconsistente.',
    {
        statusCode: 500,
        code: 'PROGRESO_INCONSISTENTE'
    }
);
        }

        return {
            juegoFinalizado: true,
            partida,
            progreso,
            acertijo: null,
            opciones: []
        };
    }

    if (partida.estado !== 'EN_CURSO') {
        throw new ErrorAplicacion(
    'La partida no está en curso.',
    {
        statusCode: 409,
        code: 'PARTIDA_NO_DISPONIBLE'
    }
);
    }

    // Buscar el acertijo actual
    const acertijo =
        await acertijoRepositorio.buscarPorId(
            progreso.id_acertijo_actual
        );

    if (!acertijo) {
        throw new ErrorAplicacion(
    'El acertijo actual no se encontró.',
    {
        statusCode: 500,
        code: 'ACERTIJO_ACTUAL_NO_ENCONTRADO'
    }
);
    }

    // Comprobar que esté asociado a esta partida
    const estadoAcertijo =
        await acertijoRepositorio.buscarEstadoEnPartida(
            idPartida,
            acertijo.id_acertijo
        );

    if (!estadoAcertijo) {
        throw new ErrorAplicacion(
    'acertijo no está asociado a esta partida.',
    {
        statusCode: 500,
        code: 'ACERTIJO_NO_ASOCIADO_A_PARTIDA'
    }
);
    }

    if (estadoAcertijo.estado !== 'PENDIENTE') {
        throw new ErrorAplicacion(
    'acertijo no está pendiente de resolución en esta partida.',
    {
        statusCode: 409,
        code: 'ACERTIJO_NOPENDIENTE'
    }
);
    }

    // Obtener opciones únicamente si es de selección
    const opciones =
        acertijo.tipo_validacion === 'SELECCION'
            ? await acertijoRepositorio.obtenerOpcionesPorAcertijo(
                acertijo.id_acertijo
            )
            : [];

    // No revelar la respuesta correcta al frontend
    const acertijoPublico = { ...acertijo };

    delete acertijoPublico.respuesta_correcta_texto;

    return {
        juegoFinalizado: false,
        partida,
        progreso,
        acertijo: {
            ...acertijoPublico,
            estado: estadoAcertijo.estado
        },
        opciones
    };
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

        let siguienteAcertijoId = null;
        let partidaFinalizada = null;



        const cliente = await this.pool.connect();

        let transaccionIniciada = false;

        try {

            // 1. INICIAR TRANSACCIÓN


            await cliente.query('BEGIN');
            transaccionIniciada = true;




            // 2. CREAR REPOSITORIOS CON EL CLIENTE

            const partidaRepositorio =
            new this.PartidaRepositorio(cliente);

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
                throw new ErrorAplicacion(
    'El progreso de la partida no se encontró.',
    {
        statusCode: 404,
        code: 'PROGRESO_NO_DISPONIBLE'
    }
);
            }

            if (progreso.id_acertijo_actual !== idAcertijo) {
               throw new ErrorAplicacion(
    'El acertijo actual no se encontró.',
    {
        statusCode: 404,
        code: 'ACERTIJO_NO_ENCONTRADO'
    }
);
            }


            // 4. COMPROBAR EL ESTADO DEL ACERTIJO

            const estadoActual =
                await acertijoRepositorio.buscarEstadoEnPartida(
                    idPartida,
                    idAcertijo
                );

            if (!estadoActual) {
                throw new ErrorAplicacion(
    'El estado del acertijo no se encontró.',
    {
        statusCode: 404,
        code: 'ESTADO_ACERTIJO_NO_ENCONTRADO'
    }
);
            }

            if (estadoActual.estado === 'RESUELTO') {
                throw new ErrorAplicacion(
    'El acertijo ya fue resuelto.',
    {
        statusCode: 500,
        code: 'ACERTIJO_YA_RESUELTO'
    }
);
            }

            if (estadoActual.estado !== 'PENDIENTE') {
                throw new ErrorAplicacion(
    'El estado actual del acertijo no es válido.',
    {
        statusCode: 404,
        code: 'ESTADO_ACERTIJO_INVALIDO'
    }
);
            }



            // 5. OBTENER LA INFORMACIÓN DEL ACERTIJO


            const datosAcertijo =
                await acertijoRepositorio.buscarPorId(idAcertijo);

            if (!datosAcertijo) {
               throw new ErrorAplicacion(
    'El acertijo no se encontró.',
    {
        statusCode: 404,
        code: 'ACERTIJO_NO_ENCONTRADO'
    }
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
                throw new ErrorAplicacion(
                    'Este acertijo requiere una respuesta de texto.',
                    {
                        statusCode: 400,
                        code: 'RESPUESTA_INVALIDA'
                    }
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
                    throw new ErrorAplicacion(
                        'Este acertijo requiere seleccionar una opción.',
                        {
                            statusCode: 400,
                            code: 'RESPUESTA_INVALIDA'
                        }
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
                    throw new ErrorAplicacion(
    'La opción seleccionada no pertenece a este acertijo.',
    {
        statusCode: 400,
        code: 'OPCION_NO_VALIDA'
    }
);
                }

                const opcionCorrecta =
                    await acertijoRepositorio.obtenerOpcionCorrecta(
                        idAcertijo
                    );

                if (!opcionCorrecta) {
                  throw new ErrorAplicacion(
    'El acertijo no tiene una opción correcta configurada.',
    {
        statusCode: 400,
        code: 'OPCION_CORRECTA_NO_ENCONTRADA'
    }
);
                }

                respuestaCorrecta = opcionCorrecta.id_opcion;
                opcionSeleccionadaFinal = idOpcionSeleccionada;

            } else {

                throw new ErrorAplicacion(
    'El tipo de validación del acertijo no es válido.',
    {
        statusCode: 400,
        code: 'TIPO_VALIDACION_INVALIDO'
    }
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







                    // 8. VALIDAR Y CONSTRUIR LA ENTIDAD INTENTO

                    const intentoValidado = new Intento({

                        idPartida,
                        idAcertijo,
                        respuestaTexto: respuestaTextoFinal,
                        idOpcionSeleccionada: opcionSeleccionadaFinal,
                        resultado

                    });

                    // Registrar el intento en PostgreSQL

                    const intento = await intentoRepositorio.guardar({

                        idPartida: intentoValidado.idPartida,
                        idAcertijo: intentoValidado.idAcertijo,
                        respuestaTexto: intentoValidado.respuestaTexto,
                        idOpcionSeleccionada: intentoValidado.idOpcionSeleccionada,
                        resultado: intentoValidado.resultado

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

            siguienteAcertijoId = siguienteAcertijo
                ? siguienteAcertijo.id_acertijo
                : null;


            // 12. ACTUALIZAR EL PROGRESO

           // Construir y validar la entidad de dominio
                const progresoValidado = new Progreso({
                    idPartida,
                    idAcertijoActual: siguienteAcertijoId
                });

                // Actualizar el progreso de la investigación
                const nuevoProgreso = await progresoRepositorio.guardar({
                    idPartida: progresoValidado.idPartida,
                    idAcertijoActual: progresoValidado.idAcertijoActual
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


                // FINALIZAR LA PARTIDA SI NO HAY
                // MÁS ACERTIJOS

                if (siguienteAcertijoId === null) {

                    const partidaActual =
                        await partidaRepositorio.buscarPorId(idPartida);

                    if (!partidaActual) {
                       throw new ErrorAplicacion(
    'La partida no fue encontrada.',
    {
        statusCode: 404,
        code: 'PARTIDA_NO_ENCONTRADA'
    }
);
                    }

                    const fechaInicio = new Date(partidaActual.fecha_inicio);

                    if (Number.isNaN(fechaInicio.getTime())) {
                        throw new ErrorAplicacion(
    'La fecha de inicio de la partida no es válida.',
    {
        statusCode: 500,
        code: 'FECHA_INICIO_INVALIDA'
    }
);
                    }

                    const tiempoTotalSegundos = Math.max(
                        0,
                        Math.floor(
                            (Date.now() - fechaInicio.getTime()) / 1000
                        )
                    );

                    partidaFinalizada =
                        await partidaRepositorio.finalizar(
                            idPartida,
                            tiempoTotalSegundos
                        );
                }


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

                partidaFinalizada,

                juegoFinalizado: siguienteAcertijoId === null,

                contenidosDisponibles,

                pistasDisponibles,

                mensaje: partidaFinalizada
                    ? '¡Felicidades! Has completado todos los expedientes.'
                    : '¡Acertijo resuelto! Has desbloqueado nuevas evidencias.'
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
