const express = require('express');

// Crear las rutas de pistas
function crearPistaRutas(pistaControlador) {

    const router = express.Router();

    // Consultar pistas disponibles
    router.get(
        '/partidas/:idPartida',
        (req, res, next) => {
            pistaControlador.obtenerDisponibles(req, res, next);
        }
    );

    // Guardar una pista
    router.post(
        '/partidas/:idPartida/:idPista/guardar',
        (req, res, next) => {
            pistaControlador.guardar(req, res, next);
        }
    );

    // Consultar pistas guardadas
    router.get(
        '/partidas/:idPartida/guardadas',
        (req, res, next) => {
            pistaControlador.obtenerGuardadas(req, res, next);
        }
    );

    return router;
}

module.exports = crearPistaRutas;