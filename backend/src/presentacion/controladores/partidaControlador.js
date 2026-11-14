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
}

// Exportar controlador
module.exports = PartidaControlador;