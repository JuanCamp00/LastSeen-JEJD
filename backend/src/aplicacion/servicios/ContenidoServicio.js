class ContenidoServicio {

    constructor(contenidoRepositorio) {

        if (!contenidoRepositorio) {
            throw new Error(
                'Se requiere un repositorio de contenidos.'
            );
        }

        this.contenidoRepositorio = contenidoRepositorio;
    }

    // Consultar los contenidos disponibles de una partida
    async obtenerPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        return await this.contenidoRepositorio
            .obtenerPorPartida(idPartida);
    }

    // Consultar un contenido específico de una partida
    async obtenerPorIdEnPartida(idPartida, idContenido) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (!Number.isInteger(idContenido) || idContenido <= 0) {
            throw new TypeError(
                'El identificador del contenido no es válido.'
            );
        }

        // Consultar únicamente los contenidos de esta partida
        const contenidos =
            await this.contenidoRepositorio.obtenerPorPartida(
                idPartida
            );

        // Comprobar que el contenido pertenece a la partida
        const contenido = contenidos.find(
            item => Number(item.id_contenido) === idContenido
        );

            if (!contenido) {

            const error = new Error(
                'El contenido no está disponible en esta partida.'
            );

            error.code = 'CONTENIDO_NO_DISPONIBLE';
            error.statusCode = 404;

            throw error;
        }

        return contenido;
    }
}

module.exports = ContenidoServicio;