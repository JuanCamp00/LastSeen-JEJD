const TipoValidacion = require('../enumeraciones/TipoValidacion');

function validar(condicion, mensaje, TipoError = TypeError) {
    if (!condicion) {
        throw new TipoError(mensaje);
    }
}

function validarEnteroPositivo(valor, mensaje) {
    validar(
        Number.isInteger(valor) && valor > 0,
        mensaje
    );
}

function validarPregunta(pregunta) {
    validar(
        typeof pregunta === 'string' && pregunta.trim() !== '',
        'La pregunta del acertijo es obligatoria.'
    );

    return pregunta.trim();
}

function validarTipoValidacion(tipoValidacion) {
    const tipo = String(tipoValidacion).trim().toUpperCase();

    validar(
        Object.values(TipoValidacion).includes(tipo),
        'El tipo de validación del acertijo no es válido.',
        Error
    );

    return tipo;
}

class Acertijo {
    constructor({
        idAcertijo,
        pregunta,
        orden,
        tipoValidacion,
        respuestaCorrectaTexto = null
    }) {
        validarEnteroPositivo(
            idAcertijo,
            'El identificador del acertijo debe ser un entero positivo.'
        );

        validarEnteroPositivo(
            orden,
            'El orden del acertijo debe ser un entero positivo.'
        );

        this.idAcertijo = idAcertijo;
        this.pregunta = validarPregunta(pregunta);
        this.orden = orden;
        this.tipoValidacion = validarTipoValidacion(tipoValidacion);
        this.respuestaCorrectaTexto = respuestaCorrectaTexto;

        this.observadores = new Set();
    }

    agregarObservador(observador) {
        validar(
            observador &&
            typeof observador.actualizar === 'function',
            'El observador debe implementar el método actualizar().'
        );

        this.observadores.add(observador);
    }

    eliminarObservador(observador) {
        this.observadores.delete(observador);
    }

    async notificarResolucion(idPartida) {
        const evento = {
            idPartida,
            idAcertijo: this.idAcertijo,
            orden: this.orden,
            tipoEvento: 'ACERTIJO_RESUELTO'
        };

        for (const observador of this.observadores) {
            await observador.actualizar(evento);
        }
    }
}

module.exports = Acertijo;