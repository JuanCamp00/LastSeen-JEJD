class Respuesta {

    constructor({
        respuestaTexto = null,
        idOpcionSeleccionada = null
    }) {

        // Validar respuesta de texto
        if (
            respuestaTexto !== null &&
            typeof respuestaTexto !== 'string'
        ) {
            throw new TypeError(
                'La respuesta de texto debe ser un texto o NULL.'
            );
        }

        const textoNormalizado =
            typeof respuestaTexto === 'string' &&
            respuestaTexto.trim().length > 0
                ? respuestaTexto.trim()
                : null;

        // Validar opción seleccionada
        if (
            idOpcionSeleccionada !== null &&
            (
                !Number.isInteger(idOpcionSeleccionada) ||
                idOpcionSeleccionada <= 0
            )
        ) {
            throw new TypeError(
                'El identificador de la opción debe ser positivo o NULL.'
            );
        }

        const tieneTexto = textoNormalizado !== null;
        const tieneOpcion = idOpcionSeleccionada !== null;

        // Exigir exactamente una modalidad
        if (tieneTexto === tieneOpcion) {
            throw new Error(
                'La respuesta debe contener texto o una opción seleccionada, pero no ambas.'
            );
        }

        this.respuestaTexto = textoNormalizado;
        this.idOpcionSeleccionada = idOpcionSeleccionada;

        // Proteger la inmutabilidad del objeto de valor
        Object.freeze(this);
    }
}

module.exports = Respuesta;