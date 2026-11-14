const express = require('express');

// Crear las rutas de partidas
function crearPartidaRutas(partidaControlador) {

    const router = express.Router();

    // Iniciar una nueva partida
    router.post(
        '/iniciar',
        (req, res, next) => {
            partidaControlador.iniciar(req, res, next);
        }
    );

    return router;
}

// Exportar las rutas
module.exports = crearPartidaRutas;