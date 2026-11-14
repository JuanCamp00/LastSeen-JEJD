const Partida = require('../../dominio/entidades/Partida');
const Progreso = require('../../dominio/entidades/Progreso');
const EstadoPartida =
    require('../../dominio/enumeraciones/EstadoPartida');
   const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class PartidaServicio {

    constructor({
        poolConexion,
        UsuarioRepositorio,
        PartidaRepositorio,
        AcertijoRepositorio,
        ProgresoRepositorio,
        ContenidoRepositorio,
        PistaRepositorio
    }) {

                if (!poolConexion || typeof poolConexion.connect !== 'function') {
            throw new ErrorAplicacion(
                'Se requiere un pool de conexiones de PostgreSQL.',
                {
                    statusCode: 500,
                    code: 'POOL_POSTGRESQL_NO_CONFIGURADO'
                }
            );
        }

        const repositorios = {
            UsuarioRepositorio,
            PartidaRepositorio,
            AcertijoRepositorio,
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
                            code: 'REPOSITORIO_NO_CONFIGURADO'
                        }
                    );
                }
            }

        this.pool = poolConexion;
        this.UsuarioRepositorio = UsuarioRepositorio;
        this.PartidaRepositorio = PartidaRepositorio;
        this.AcertijoRepositorio = AcertijoRepositorio;
        this.ProgresoRepositorio = ProgresoRepositorio;
        this.ContenidoRepositorio = ContenidoRepositorio;
        this.PistaRepositorio = PistaRepositorio;
    }



    // 1. INICIAR UNA NUEVA PARTIDA

    async iniciarPartida(idUsuario) {

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        const cliente = await this.pool.connect();

        let transaccionIniciada = false;

        try {

            // Comenzar la transacción
            await cliente.query('BEGIN');
            transaccionIniciada = true;


            // Crear repositorios utilizando el mismo cliente
            const usuarioRepositorio =
                new this.UsuarioRepositorio(cliente);

            const partidaRepositorio =
                new this.PartidaRepositorio(cliente);

            const acertijoRepositorio =
                new this.AcertijoRepositorio(cliente);

            const progresoRepositorio =
                new this.ProgresoRepositorio(cliente);

            const contenidoRepositorio =
                new this.ContenidoRepositorio(cliente);

            const pistaRepositorio =
                new this.PistaRepositorio(cliente);


            // 1. Comprobar que el usuario exista
            const usuario =
                await usuarioRepositorio.buscarPorId(idUsuario);

                if (!usuario) {
            throw new ErrorAplicacion(
                'No se puede iniciar una partida: el usuario no existe.',
                {
                    statusCode: 404,
                    code: 'USUARIO_NO_ENCONTRADO'
                }
            );
        }


            // 2. Obtener los acertijos disponibles
            const acertijos =
                await acertijoRepositorio.obtenerAcertijos();

                        if (acertijos.length === 0) {
                    throw new ErrorAplicacion(
                        'No hay acertijos registrados para iniciar la partida.',
                        {
                            statusCode: 500,
                            code: 'ACERTIJOS_NO_CONFIGURADOS'
                        }
                    );
                }

            const primerAcertijo = acertijos[0];



            // 3. Crear y validar la entidad de dominio
            const nuevaPartida = new Partida({
                idUsuario,
                estado: EstadoPartida.EN_CURSO
            });

            // 4. Guardar la partida en PostgreSQL
            const partida = await partidaRepositorio.guardar({
                idUsuario: nuevaPartida.idUsuario,
                estado: nuevaPartida.estado
            });


            // 4. Asociar todos los acertijos a la partida
            const acertijosAsociados =
                await acertijoRepositorio.asociarTodosALaPartida(
                    partida.id_partida
                );

                        if (acertijosAsociados.length !== acertijos.length) {
                    throw new ErrorAplicacion(
                        'No se pudieron asociar todos los acertijos a la partida.',
                        {
                            statusCode: 500,
                            code: 'ASOCIACION_ACERTIJOS_INCOMPLETA'
                        }
                    );
                }


            // 5. Registrar el progreso inicial
            // Construir y validar la entidad de dominio
                const progresoInicial = new Progreso({
                    idPartida: partida.id_partida,
                    idAcertijoActual: primerAcertijo.id_acertijo
                });

                // Guardar el progreso inicial
                const progreso = await progresoRepositorio.guardar({
                    idPartida: progresoInicial.idPartida,
                    idAcertijoActual: progresoInicial.idAcertijoActual
                });


            // 6. Registrar los contenidos disponibles desde el inicio
            const contenidosIniciales =
                await contenidoRepositorio.registrarContenidosIniciales(
                    partida.id_partida
                );


            // 7. Registrar las pistas disponibles desde el inicio
            const pistasIniciales =
                await pistaRepositorio.registrarPistasIniciales(
                    partida.id_partida
                );


            // Confirmar todas las operaciones
            await cliente.query('COMMIT');
            transaccionIniciada = false;


            // Devolver el resumen de la partida creada
            return {
                partida,
                acertijosAsociados: acertijosAsociados.length,
                progreso,
                contenidosIniciales,
                pistasIniciales
            };

        } catch (error) {

            // Revertir todos los cambios si algo falla
            if (transaccionIniciada) {
                await cliente.query('ROLLBACK').catch(() => {});
            }

            throw error;

        } finally {

            // Liberar el cliente de PostgreSQL
            cliente.release();
        }
    }

}


// Exportar el servicio
module.exports = PartidaServicio;
