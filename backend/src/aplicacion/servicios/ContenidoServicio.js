const Contenido = require('../../dominio/entidades/Contenido');

const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class ContenidoServicio {

    constructor(contenidoRepositorio) {

            if (!contenidoRepositorio) {
            throw new ErrorAplicacion(
                'Se requiere un repositorio de contenidos.',
                {
                    statusCode: 500,
                    code: 'REPOSITORIO_CONTENIDO_NO_CONFIGURADO'
                }
            );
        }

        this.contenidoRepositorio = contenidoRepositorio;
    }

    // Consultar los contenidos disponibles de una partida
            async obtenerPorPartida(idPartida) {

            if (!Number.isInteger(idPartida) || idPartida <= 0) {
                throw new TypeError(
                    'El identificador de la partida no es válido.'
                );
            }

            const contenidos =
                await this.contenidoRepositorio.obtenerPorPartida(
                    idPartida
                );

            return contenidos.map(fila => {

                // Construir y validar la entidad de dominio
                const contenido = new Contenido({
                    idContenido: fila.id_contenido,
                    idAcertijoDesbloqueador:
                        fila.id_acertijo_desbloqueador,
                    titulo: fila.titulo,
                    descripcion: fila.descripcion,
                    tipoContenido: fila.tipo_contenido,
                    recurso: fila.recurso
                });

                // Conservar el formato que espera el frontend
                return {
                    id_contenido: contenido.idContenido,
                    id_acertijo_desbloqueador:
                        contenido.idAcertijoDesbloqueador,
                    titulo: contenido.titulo,
                    descripcion: contenido.descripcion,
                    tipo_contenido: contenido.tipoContenido,
                    recurso: contenido.recurso,
                    desbloqueado_en: fila.desbloqueado_en
                };
            });
        }

    // Consultar un contenido específico de una partida
    async obtenerPorIdEnPartida(idPartida, idContenido) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (!Number.isInteger(idContenido) || idContenido <= 0) {
            throw new TypeError(
                'El identificador del contenido no es válido.'
            );
        }

        // Consultar únicamente los contenidos de esta partida
        const contenidos =
            await this.contenidoRepositorio.obtenerPorPartida(
                idPartida
            );

        // Comprobar que el contenido pertenece a la partida
        const contenido = contenidos.find(
            item => Number(item.id_contenido) === idContenido
        );

            if (!contenido) {

            const error = new Error(
                'El contenido no está disponible en esta partida.'
            );

            error.code = 'CONTENIDO_NO_DISPONIBLE';
            error.statusCode = 404;

            throw error;
        }

        return contenido;
    }
}

module.exports = ContenidoServicio;