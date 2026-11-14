class ProgresoServicio {

    constructor(progresoRepositorio) {

        if (!progresoRepositorio) {
            throw new Error(
                'Se requiere un repositorio de progreso.'
            );
        }

        this.progresoRepositorio = progresoRepositorio;
    }

    // Consultar el progreso de una partida
    async obtenerPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        const progreso =
            await this.progresoRepositorio.buscarPorPartida(
                idPartida
            );

        if (!progreso) {
            throw new Error(
                'No se encontró el progreso de la partida.'
            );
        }

        return progreso;
    }

    // Guardar o actualizar el progreso de una partida
    async guardar({ idPartida, idAcertijoActual }) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (
            idAcertijoActual !== null &&
            (!Number.isInteger(idAcertijoActual) ||
                idAcertijoActual <= 0)
        ) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo o NULL.'
            );
        }

        return await this.progresoRepositorio.guardar({
            idPartida,
            idAcertijoActual
        });
    }
}

module.exports = ProgresoServicio;