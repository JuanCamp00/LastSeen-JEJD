const express = require('express');

// Crear las rutas de intentos
function crearIntentoRutas(intentoControlador) {

    const router = express.Router();

    // Consultar todos los intentos de una partida
    router.get(
        '/partidas/:idPartida',
        (req, res, next) => {
            intentoControlador.obtenerPorPartida(
                req,
                res,
                next
            );
        }
    );

    // Consultar un intento específico
    router.get(
        '/:idIntento',
        (req, res, next) => {
            intentoControlador.obtenerPorId(
                req,
                res,
                next
            );
        }
    );

    return router;
}

module.exports = crearIntentoRutas;