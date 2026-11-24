function validar(condicion, mensaje, TipoError = TypeError) {
    if (!condicion) {
        throw new TipoError(mensaje);
    }
}
function validarIdentificador(id, mensaje) {
    validar(
        Number.isInteger(id) && id > 0,
        mensaje
    );
}

function validarIdPista(idPista) {
    validar(
        idPista === null ||
        (Number.isInteger(idPista) && idPista > 0),
        'El identificador de la pista debe ser positivo o NULL.'
    );
}

function validarContenido(contenido) {
    validar(
        typeof contenido === 'string' &&
        contenido.trim().length > 0,
        'El contenido de la pista es obligatorio.'
    );

    return contenido.trim();
}

function validarDisponibilidad(disponibleDesdeInicio) {
    validar(
        typeof disponibleDesdeInicio === 'boolean',
        'La disponibilidad inicial debe ser verdadera o falsa.'
    );
}

class Pista {
    constructor({
        idPista = null,
        idAcertijo,
        contenido,
        orden,
        disponibleDesdeInicio
    }) {
        validarIdPista(idPista);

        validarIdentificador(
            idAcertijo,
            'El identificador del acertijo debe ser positivo.'
        );

        const contenidoNormalizado = validarContenido(contenido);

        validarIdentificador(
            orden,
            'El orden de la pista debe ser un entero positivo.'
        );

        validarDisponibilidad(disponibleDesdeInicio);

        this.idPista = idPista;
        this.idAcertijo = idAcertijo;
        this.contenido = contenidoNormalizado;
        this.orden = orden;
        this.disponibleDesdeInicio = disponibleDesdeInicio;
    }
}

module.exports = Pista;