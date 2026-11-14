const express = require('express');

// Crear las rutas de acertijos
function crearAcertijoRutas(acertijoControlador) {

    const router = express.Router();

    // Consultar el acertijo actual
    router.get(
        '/partidas/:idPartida/actual',
        (req, res, next) => {
            acertijoControlador.obtenerActual(req, res, next);
        }
    );

    // Enviar una respuesta a un acertijo
    router.post(
        '/partidas/:idPartida/resolver',
        (req, res, next) => {
            acertijoControlador.resolver(req, res, next);
        }
    );

    return router;
}

module.exports = crearAcertijoRutas;