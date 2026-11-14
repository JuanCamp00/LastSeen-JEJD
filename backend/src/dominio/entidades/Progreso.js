class Progreso {

    constructor({
        idProgreso = null,
        idPartida,
        idAcertijoActual = null,
        fechaActualizacion = null
    }) {

        // Validar identificador del progreso
        if (
            idProgreso !== null &&
            (!Number.isInteger(idProgreso) || idProgreso <= 0)
        ) {
            throw new TypeError(
                'El identificador del progreso debe ser positivo o NULL.'
            );
        }

        // Validar partida
        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser positivo.'
            );
        }

        // Validar acertijo actual
        if (
            idAcertijoActual !== null &&
            (
                !Number.isInteger(idAcertijoActual) ||
                idAcertijoActual <= 0
            )
        ) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo o NULL.'
            );
        }

        // Validar fecha de actualización
        let fechaNormalizada = null;

        if (fechaActualizacion !== null) {
            fechaNormalizada = new Date(fechaActualizacion);

            if (Number.isNaN(fechaNormalizada.getTime())) {
                throw new TypeError(
                    'La fecha de actualización del progreso no es válida.'
                );
            }
        }

        // Asignar atributos
        this.idProgreso = idProgreso;
        this.idPartida = idPartida;
        this.idAcertijoActual = idAcertijoActual;
        this.fechaActualizacion = fechaNormalizada;
    }
}

module.exports = Progreso;