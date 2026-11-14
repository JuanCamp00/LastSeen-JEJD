class Pista {

    constructor({
        idPista = null,
        idAcertijo,
        contenido,
        orden,
        disponibleDesdeInicio
    }) {

        // Validar identificador de la pista
        if (
            idPista !== null &&
            (!Number.isInteger(idPista) || idPista <= 0)
        ) {
            throw new TypeError(
                'El identificador de la pista debe ser positivo o NULL.'
            );
        }

        // Validar acertijo asociado
        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo.'
            );
        }

        // Validar contenido
        if (
            typeof contenido !== 'string' ||
            contenido.trim().length === 0
        ) {
            throw new TypeError(
                'El contenido de la pista es obligatorio.'
            );
        }

        // Validar orden
        if (!Number.isInteger(orden) || orden <= 0) {
            throw new TypeError(
                'El orden de la pista debe ser un entero positivo.'
            );
        }

        // Validar disponibilidad inicial
        if (typeof disponibleDesdeInicio !== 'boolean') {
            throw new TypeError(
                'La disponibilidad inicial debe ser verdadera o falsa.'
            );
        }

        // Asignar atributos
        this.idPista = idPista;
        this.idAcertijo = idAcertijo;
        this.contenido = contenido.trim();
        this.orden = orden;
        this.disponibleDesdeInicio = disponibleDesdeInicio;
    }
}

module.exports = Pista;