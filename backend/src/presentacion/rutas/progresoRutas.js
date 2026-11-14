const express = require('express');

// Crear las rutas de progreso
function crearProgresoRutas(progresoControlador) {

    const router = express.Router();

    // Consultar el progreso de una partida
    router.get(
        '/partidas/:idPartida',
        (req, res, next) => {
            progresoControlador.obtenerPorPartida(
                req,
                res,
                next
            );
        }
    );

    return router;
}

module.exports = crearProgresoRutas;