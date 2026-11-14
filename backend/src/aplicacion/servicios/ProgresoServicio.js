const Progreso = require('../../dominio/entidades/Progreso');
const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class ProgresoServicio {

        constructor(progresoRepositorio) {

             if (!progresoRepositorio) {
                 throw new ErrorAplicacion(
                'Se requiere un repositorio de progreso.',
                {
                    statusCode: 500,
                    code: 'REPOSITORIO_PROGRESO_NO_CONFIGURADO'
                }
            );
        }

        this.progresoRepositorio = progresoRepositorio;
    }

    // Consultar el progreso de una partida
        async obtenerPorPartida(idPartida) {

             if (!Number.isInteger(idPartida) || idPartida <= 0) {
                throw new TypeError(
                    'El identificador de la partida no es válido.'
            );
        }

        const fila =
            await this.progresoRepositorio.buscarPorPartida(idPartida);
            
        if (!fila) {
            throw new ErrorAplicacion(
                'No se encontró el progreso de la partida.',
                {
                    statusCode: 409,
                    code: 'PROGRESO_NO_DISPONIBLE'
                }
            );
        }

        const progreso = new Progreso({
            idProgreso: fila.id_progreso,
            idPartida: fila.id_partida,
            idAcertijoActual: fila.id_acertijo_actual,
            fechaActualizacion: fila.fecha_actualizacion
        });

        // Conservar el formato utilizado por el controlador y frontend
        return {
            ...fila,
            id_progreso: progreso.idProgreso,
            id_partida: progreso.idPartida,
            id_acertijo_actual: progreso.idAcertijoActual,
            fecha_actualizacion: progreso.fechaActualizacion
        };
    }

    // Guardar o actualizar el progreso de una partida
        async guardar({ idPartida, idAcertijoActual }) {

            // Construir y validar la entidad
            const progreso = new Progreso({
                idPartida,
                idAcertijoActual
            });

            // Guardar utilizando el repositorio existente
            const fila = await this.progresoRepositorio.guardar({
                idPartida: progreso.idPartida,
                idAcertijoActual: progreso.idAcertijoActual
            });

            // Validar el registro devuelto por PostgreSQL
            const progresoGuardado = new Progreso({
                idProgreso: fila.id_progreso,
                idPartida: fila.id_partida,
                idAcertijoActual: fila.id_acertijo_actual,
                fechaActualizacion: fila.fecha_actualizacion
            });

            return {
                ...fila,
                id_progreso: progresoGuardado.idProgreso,
                id_partida: progresoGuardado.idPartida,
                id_acertijo_actual: progresoGuardado.idAcertijoActual,
                fecha_actualizacion: progresoGuardado.fechaActualizacion
            };
        }
}

module.exports = ProgresoServicio;