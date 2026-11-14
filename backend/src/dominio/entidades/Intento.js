const ResultadoIntento = require('../enumeraciones/ResultadoIntento');
const Respuesta = require('./Respuesta');

class Intento {

    constructor({
        idIntento = null,
        idPartida,
        idAcertijo,
        fechaIntento = null,
        respuestaTexto = null,
        idOpcionSeleccionada = null,
        resultado
    }) {

        // Validar identificador del intento
        if (
            idIntento !== null &&
            (!Number.isInteger(idIntento) || idIntento <= 0)
        ) {
            throw new TypeError(
                'El identificador del intento debe ser positivo o NULL.'
            );
        }

        // Validar partida
        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser positivo.'
            );
        }

        // Validar acertijo
        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo.'
            );
        }

        // Validar fecha
        let fechaNormalizada = null;

        if (fechaIntento !== null) {
            fechaNormalizada = new Date(fechaIntento);

            if (Number.isNaN(fechaNormalizada.getTime())) {
                throw new TypeError(
                    'La fecha del intento no es válida.'
                );
            }
        }


        // Construir y validar el objeto de valor Respuesta
        const respuesta = new Respuesta({
            respuestaTexto,
            idOpcionSeleccionada
        });

        // Validar resultado
        const resultadoNormalizado =
            String(resultado).trim().toUpperCase();

        if (
            !Object.values(ResultadoIntento).includes(
                resultadoNormalizado
            )
        ) {
                        throw new TypeError(
                'El resultado del intento no es válido.'
            );

        }

        // Asignar atributos
        this.idIntento = idIntento;
        this.idPartida = idPartida;
        this.idAcertijo = idAcertijo;
        this.fechaIntento = fechaNormalizada;
        this.respuestaTexto = respuesta.respuestaTexto;
        this.idOpcionSeleccionada = respuesta.idOpcionSeleccionada;
        this.resultado = resultadoNormalizado;
    }
}

module.exports = Intento;
