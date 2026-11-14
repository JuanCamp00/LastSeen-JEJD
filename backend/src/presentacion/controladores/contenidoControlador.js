const fs = require('fs/promises');
const path = require('path');

class ContenidoControlador {

    constructor(contenidoServicio) {
        this.contenidoServicio = contenidoServicio;
    }

    // Consultar los contenidos disponibles de una partida
    async obtenerDisponibles(req, res, next) {

        try {
            const idPartida = Number(req.params.idPartida);

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                return res.status(400).json({
                    mensaje: 'El identificador de la partida no es válido.'
                });
            }

            const contenidos =
                await this.contenidoServicio.obtenerPorPartida(
                    idPartida
                );

            return res.status(200).json({
                idPartida,
                contenidos
            });

        } catch (error) {
            next(error);
        }
    }

    // Consultar un contenido específico de una partida
async obtenerPorId(req, res, next) {

    try {
        const idPartida = Number(req.params.idPartida);
        const idContenido = Number(req.params.idContenido);

        if (
            !Number.isInteger(idPartida) || idPartida <= 0 ||
            !Number.isInteger(idContenido) || idContenido <= 0
        ) {
            return res.status(400).json({
                mensaje: 'Los identificadores no son válidos.'
            });
        }

        const contenido =
            await this.contenidoServicio.obtenerPorIdEnPartida(
                idPartida,
                idContenido
            );

        return res.status(200).json({
            contenido
        });

    } catch (error) {

        if (error.code === 'CONTENIDO_NO_DISPONIBLE') {
            return res.status(404).json({
                mensaje: error.message
            });
        }

        next(error);
    }
}
    // Consultar un contenido específico de una partida
    // Abrir el archivo de un contenido disponible en la partida
        async obtenerArchivo(req, res, next) {

            try {
                const idPartida = Number(req.params.idPartida);
                const idContenido = Number(req.params.idContenido);

                if (!Number.isInteger(idPartida) || idPartida <= 0 ||
                    !Number.isInteger(idContenido) || idContenido <= 0) {
                    return res.status(400).json({
                        mensaje: 'Los identificadores no son válidos.'
                    });
                }

        // Verificar primero que el documento esté disponible
        // en esta partida concreta
        const contenido =
            await this.contenidoServicio.obtenerPorIdEnPartida(
                idPartida,
                idContenido
            );

        // Directorio raíz del frontend
        const directorioFrontend = path.resolve(
            __dirname,
            '../../../../frontend'
        );

        // Convertir la ruta registrada en PostgreSQL
        // en una ruta relativa al frontend
        const recurso = contenido.recurso.replace(/^\/+/, '');

        const rutaArchivo = path.resolve(
            directorioFrontend,
            recurso
        );

        // Evitar que se pueda acceder fuera del directorio permitido
        const rutaRelativa = path.relative(
            directorioFrontend,
            rutaArchivo
        );

        if (
            rutaRelativa.startsWith('..') ||
            path.isAbsolute(rutaRelativa)
        ) {
            return res.status(403).json({
                mensaje: 'No está permitido acceder a esa ubicación.'
            });
        }

        // Leer el documento
        const archivo = await fs.readFile(rutaArchivo, 'utf8');

        // Devolver su contenido como texto
        return res
            .status(200)
            .type('text/plain')
            .send(archivo);

   } catch (error) {

    console.error(
        'ERROR AL ABRIR DOCUMENTO:',
        error.code,
        error.statusCode,
        error.message
    );

    if (error.code === 'CONTENIDO_NO_DISPONIBLE') {
        return res.status(404).json({
            mensaje: error.message
        });
    }

    if (error.code === 'ENOENT') {
        return res.status(404).json({
            mensaje: 'No se encontró el archivo solicitado.'
        });
    }

    next(error);
}
}
}

module.exports = ContenidoControlador;