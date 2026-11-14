const express = require('express');

// Crear las rutas de contenidos
function crearContenidoRutas(contenidoControlador) {

    // Primero crear el router
    const router = express.Router();

    // 1. Consultar contenidos disponibles de una partida
    router.get(
        '/partidas/:idPartida',
        (req, res, next) => {
            contenidoControlador.obtenerDisponibles(
                req,
                res,
                next
            );
        }
    );

    // 2. Abrir el archivo de un contenido desbloqueado
    router.get(
        '/partidas/:idPartida/:idContenido/archivo',
        (req, res, next) => {
            contenidoControlador.obtenerArchivo(
                req,
                res,
                next
            );
        }
    );

    // 3. Consultar un contenido específico
    router.get(
        '/partidas/:idPartida/:idContenido',
        (req, res, next) => {
            contenidoControlador.obtenerPorId(
                req,
                res,
                next
            );
        }
    );

    return router;
}

module.exports = crearContenidoRutas;