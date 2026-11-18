const express = require('express');

// Crear las rutas de partidas
function crearPartidaRutas(partidaControlador) {

    const router = express.Router();

    // Consultar una partida por ID (incluye tiempo_total_segundos).
    router.get('/:idPartida', (req, res, next) => {
        partidaControlador.obtenerPorId(req, res, next);
    });

    // Recuperar la partida activa más reciente de un usuario
    router.get(
        '/usuario/:idUsuario/activa',
        (req, res, next) => {
            partidaControlador.obtenerActiva(req, res, next);
        }
    );

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