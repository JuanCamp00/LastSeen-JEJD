class PistaControlador {

    constructor(pistaServicio) {
        this.pistaServicio = pistaServicio;
    }

    // Consultar las pistas disponibles de una partida
    async obtenerDisponibles(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const pistas =
                await this.pistaServicio.obtenerDisponiblesPorPartida(
                    idPartida
                );

            return res.status(200).json({
                idPartida,
                pistas
            });

        } catch (error) {
            next(error);
        }
    }

    // Guardar una pista en la investigación
    async guardar(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);
            const idPista = Number(req.params.idPista);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            if (!Number.isInteger(idPista) || idPista <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la pista no es válido.'
                });
            }

            const pista =
                await this.pistaServicio.guardarPista(
                    idPartida,
                    idPista
                );

            return res.status(200).json({
                mensaje: 'Pista guardada correctamente.',
                pista
            });

        } catch (error) {
            next(error);
        }
    }

    // Consultar las pistas guardadas de una partida
    async obtenerGuardadas(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const pistas =
                await this.pistaServicio.obtenerGuardadasPorPartida(
                    idPartida
                );

            return res.status(200).json({
                idPartida,
                pistas
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = PistaControlador;