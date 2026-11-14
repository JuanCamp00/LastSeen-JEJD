function manejoErrores(error, req, res, next) {

    if (res.headersSent) {
        return next(error);
    }

    // Determinar el código HTTP
    let statusCode = error.statusCode || error.status;

    // Errores conocidos de PostgreSQL
    if (error.code === '23505') {
        statusCode = 409;
    } else if (
        error.code === 'ENOENT' ||
        error.code === 'CONTENIDO_NO_DISPONIBLE'
    ) {
        statusCode = 404;
    } else if (error instanceof TypeError) {
        statusCode = 400;
    }

    // Validar el código HTTP
    if (
        !Number.isInteger(statusCode) ||
        statusCode < 400 ||
        statusCode > 599
    ) {
        statusCode = 500;
    }

    // No revelar detalles internos en errores inesperados
    let mensaje;

    if (error.code === '23505') {
        mensaje = 'El registro ya existe.';
    } else if (error.code === 'ENOENT') {
        mensaje = 'No se encontró el archivo solicitado.';
    } else if (statusCode >= 500) {
        mensaje = 'Ocurrió un error interno en el servidor.';
    } else {
        mensaje = error.message || 'No se pudo procesar la solicitud.';
    }

    // Registrar el error en el servidor
    console.error('[ERROR API]', error);

    return res.status(statusCode).json({
        mensaje,
        ...(error.code ? { codigo: error.code } : {})
    });
}

module.exports = manejoErrores;
