const express = require('express');

// Crear las rutas de usuarios
function crearUsuarioRutas(usuarioControlador) {

    const router = express.Router();

    // Identificar o registrar un usuario
    router.post(
        '/identificar',
        (req, res, next) => {
            usuarioControlador.identificar(req, res, next);
        }
    );

    return router;
}

// Exportar las rutas
module.exports = crearUsuarioRutas;