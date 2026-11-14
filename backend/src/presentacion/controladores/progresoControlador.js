class ProgresoControlador {

    constructor(progresoServicio) {
        this.progresoServicio = progresoServicio;
    }

    // Consultar el progreso de una partida
    async obtenerPorPartida(req, res, next) {

        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const progreso =
                await this.progresoServicio.obtenerPorPartida(
                    idPartida
                );

            return res.status(200).json({
                idPartida,
                progreso,
                juegoFinalizado:
                    progreso.id_acertijo_actual === null
            });

        } catch (error) {

            if (
                error.message ===
                'No se encontró el progreso de la partida.'
            ) {
                return res.status(404).json({
                    mensaje: error.message
                });
            }

            next(error);
        }
    }
}

module.exports = ProgresoControlador;