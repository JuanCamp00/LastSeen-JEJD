function rutaNoEncontrada(req, res, next) {

    return res.status(404).json({
        mensaje: 'La ruta solicitada no existe.',
        ruta: req.originalUrl,
        metodo: req.method
    });
}

module.exports = rutaNoEncontrada;
