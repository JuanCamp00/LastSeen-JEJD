const TipoValidacion = require('../enumeraciones/TipoValidacion');

class Acertijo {

    constructor({
        idAcertijo,
        pregunta,
        orden,
        tipoValidacion,
        respuestaCorrectaTexto = null
    }) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        if (typeof pregunta !== 'string' || pregunta.trim() === '') {
            throw new TypeError(
                'La pregunta del acertijo es obligatoria.'
            );
        }

        if (!Number.isInteger(orden) || orden <= 0) {
            throw new TypeError(
                'El orden del acertijo debe ser un entero positivo.'
            );
        }

            const tipo = String(tipoValidacion).trim().toUpperCase();

        if (!Object.values(TipoValidacion).includes(tipo)) {
            throw new Error(
                'El tipo de validación del acertijo no es válido.'
            );
        }

        this.idAcertijo = idAcertijo;
        this.pregunta = pregunta.trim();
        this.orden = orden;
        this.tipoValidacion = tipo;
        this.respuestaCorrectaTexto = respuestaCorrectaTexto;

        // Colección de observadores interesados en la resolución.
        this.observadores = new Set();
    }


    // 1. AGREGAR UN OBSERVADOR
    

    agregarObservador(observador) {

        if (
            !observador ||
            typeof observador.actualizar !== 'function'
        ) {
            throw new TypeError(
                'El observador debe implementar el método actualizar().'
            );
        }

        this.observadores.add(observador);
    }


    // 2. ELIMINAR UN OBSERVADOR
    
    eliminarObservador(observador) {

        this.observadores.delete(observador);
    }


    
    // 3. NOTIFICAR LA RESOLUCIÓN
    

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


// Exportar la entidad
module.exports = Acertijo;

