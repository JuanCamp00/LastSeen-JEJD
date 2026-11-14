class IntentoControlador {

    constructor(intentoServicio) {
        this.intentoServicio = intentoServicio;
    }

    // Consultar el historial de intentos de una partida
    async obtenerPorPartida(req, res, next) {

        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const intentos =
                await this.intentoServicio.obtenerPorPartida(
                    idPartida
                );

            return res.status(200).json({
                idPartida,
                totalIntentos: intentos.length,
                intentos
            });

        } catch (error) {
            next(error);
        }
    }

    // Consultar un intento específico
    async obtenerPorId(req, res, next) {

        try {
            const idIntento = Number(req.params.idIntento);

            if (!Number.isInteger(idIntento) || idIntento <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador del intento no es válido.'
                });
            }

            const intento =
                await this.intentoServicio.obtenerPorId(idIntento);

            return res.status(200).json({
                intento
            });

        } catch (error) {

            if (
                error.message ===
                'No se encontró el intento solicitado.'
            ) {
                return res.status(404).json({
                    mensaje: error.message
                });
            }

            next(error);
        }
    }
}

module.exports = IntentoControlador;