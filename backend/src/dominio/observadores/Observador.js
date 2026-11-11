
class Observador {

    constructor() {

        if (new.target === Observador) {
            throw new Error(
                'Observador es una clase base y no debe instanciarse directamente.'
            );
        }

    }


    // RECIBIR UNA NOTIFICACION

    async actualizar(evento) {

        throw new Error(
            'El método actualizar() debe implementarse en el observador concreto.'
        );
    }

}


module.exports = Observador;
