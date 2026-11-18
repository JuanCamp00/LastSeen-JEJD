class PartidaControlador {

    constructor(partidaServicio) {
        this.partidaServicio = partidaServicio;
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