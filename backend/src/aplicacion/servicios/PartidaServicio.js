
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
            throw new Error('Se requiere un pool de conexiones de PostgreSQL.');
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
                throw new Error(
                    `No se proporcionó correctamente ${nombre}.`
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
                throw new Error(
                    'No se puede iniciar una partida: el usuario no existe.'
                );
            }


            // 2. Obtener los acertijos disponibles
            const acertijos =
                await acertijoRepositorio.obtenerAcertijos();

            if (acertijos.length === 0) {
                throw new Error(
                    'No hay acertijos registrados para iniciar la partida.'
                );
            }

            const primerAcertijo = acertijos[0];


            // 3. Crear la partida
            const partida = await partidaRepositorio.guardar({
                idUsuario,
                estado: 'EN_CURSO'
            });


            // 4. Asociar todos los acertijos a la partida
            const acertijosAsociados =
                await acertijoRepositorio.asociarTodosALaPartida(
                    partida.id_partida
                );

            if (acertijosAsociados.length !== acertijos.length) {
                throw new Error(
                    'No se pudieron asociar todos los acertijos a la partida.'
                );
            }


            // 5. Registrar el progreso inicial
            const progreso = await progresoRepositorio.guardar({
                idPartida: partida.id_partida,
                idAcertijoActual: primerAcertijo.id_acertijo
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
