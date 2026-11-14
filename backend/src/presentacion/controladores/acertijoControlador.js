class AcertijoControlador {

    constructor(acertijoServicio) {
        this.acertijoServicio = acertijoServicio;
    }

    // Consultar el acertijo actual de una partida
    async obtenerActual(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const resultado =
                await this.acertijoServicio.obtenerAcertijoActual(
                    idPartida
                );

            return res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }

    // Resolver un acertijo y registrar el intento
    async resolver(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);

            const {
                idAcertijo,
                respuestaTexto = null,
                idOpcionSeleccionada = null
            } = req.body;

            const acertijoId = Number(idAcertijo);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            if (!Number.isInteger(acertijoId) || acertijoId <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador del acertijo no es válido.'
                });
            }

            if (
                respuestaTexto === null &&
                idOpcionSeleccionada === null
            ) {
                return res.status(400).json({
                    mensaje: 'Debes proporcionar una respuesta.'
                });
            }

            if (
                respuestaTexto !== null &&
                typeof respuestaTexto !== 'string'
            ) {
                return res.status(400).json({
                    mensaje: 'La respuesta de texto no es válida.'
                });
            }

            const opcionId = idOpcionSeleccionada === null
                ? null
                : Number(idOpcionSeleccionada);

            if (
                opcionId !== null &&
                (!Number.isInteger(opcionId) || opcionId <= 0)
            ) {
                return res.status(400).json({
                    mensaje: 'La opción seleccionada no es válida.'
                });
            }

            const resultado =
                await this.acertijoServicio.resolverAcertijo({
                    idPartida,
                    idAcertijo: acertijoId,
                    respuestaTexto,
                    idOpcionSeleccionada: opcionId
                });

            return res.status(200).json(resultado);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AcertijoControlador;