class Contenido {

    constructor({
        idContenido = null,
        idAcertijoDesbloqueador = null,
        titulo,
        descripcion = null,
        tipoContenido,
        recurso
    }) {

        // Validar identificador del contenido
        if (
            idContenido !== null &&
            (!Number.isInteger(idContenido) || idContenido <= 0)
        ) {
            throw new TypeError(
                'El identificador del contenido debe ser positivo o NULL.'
            );
        }

        // Validar acertijo desbloqueador
        if (
            idAcertijoDesbloqueador !== null &&
            (
                !Number.isInteger(idAcertijoDesbloqueador) ||
                idAcertijoDesbloqueador <= 0
            )
        ) {
            throw new TypeError(
                'El identificador del acertijo desbloqueador no es válido.'
            );
        }

        // Validar título
        if (
            typeof titulo !== 'string' ||
            titulo.trim().length === 0
        ) {
            throw new TypeError(
                'El título del contenido es obligatorio.'
            );
        }

        const tituloNormalizado = titulo.trim();

        if (tituloNormalizado.length > 120) {
            throw new Error(
                'El título no puede superar los 120 caracteres.'
            );
        }

        // Validar descripción
        if (
            descripcion !== null &&
            typeof descripcion !== 'string'
        ) {
            throw new TypeError(
                'La descripción debe ser un texto o NULL.'
            );
        }

        // Validar tipo de contenido
        if (
            typeof tipoContenido !== 'string' ||
            tipoContenido.trim().length === 0
        ) {
            throw new TypeError(
                'El tipo de contenido es obligatorio.'
            );
        }

        const tipoNormalizado = tipoContenido.trim().toUpperCase();

        if (tipoNormalizado.length > 16) {
            throw new Error(
                'El tipo de contenido no puede superar los 16 caracteres.'
            );
        }

        // Validar recurso
        if (
            typeof recurso !== 'string' ||
            recurso.trim().length === 0
        ) {
            throw new TypeError(
                'La ruta del recurso es obligatoria.'
            );
        }

        // Asignar atributos
        this.idContenido = idContenido;
        this.idAcertijoDesbloqueador = idAcertijoDesbloqueador;
        this.titulo = tituloNormalizado;
        this.descripcion = descripcion;
        this.tipoContenido = tipoNormalizado;
        this.recurso = recurso.trim();
    }
}

module.exports = Contenido;