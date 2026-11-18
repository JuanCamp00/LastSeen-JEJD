class PartidaControlador {

    constructor(partidaServicio) {
        this.partidaServicio = partidaServicio;
    }



    // Consultar los datos de una partida (incluido el tiempo total)
    async obtenerPorId(req, res, next) {
        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const partida = await this.partidaServicio.obtenerPorId(idPartida);

            if (!partida) {
                return res.status(404).json({
                    mensaje: 'No se encontró la partida solicitada.'
                });
            }

            return res.status(200).json({ partida });
        } catch (error) {
            next(error);
        }
    }

    // Iniciar una nueva partida
    async iniciar(req, res, next) {

        try {

            const { idUsuario } = req.body;

            const resultado =
                await this.partidaServicio.iniciarPartida(idUsuario);

            return res.status(201).json({
                mensaje: 'Partida iniciada correctamente.',
                ...resultado
            });

        } catch (error) {
            next(error);
        }
    }

    // Consultar si el usuario tiene una partida en curso
    async obtenerActiva(req, res, next) {
        try {
            const idUsuario = Number(req.params.idUsuario);
            if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
                return res.status(400).json({ mensaje: 'El identificador del usuario no es válido.' });
            }
            const partida = await this.partidaServicio.obtenerPartidaActiva(idUsuario);
            return res.status(200).json({ partida });
        } catch (error) {
            next(error);
        }
    }

}

// Exportar controlador
module.exports = PartidaControlador;