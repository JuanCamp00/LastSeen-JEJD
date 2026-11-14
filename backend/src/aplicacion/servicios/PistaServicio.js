class PistaServicio {

    constructor(pistaRepositorio) {

        if (!pistaRepositorio) {
            throw new Error(
                'Se requiere un repositorio de pistas.'
            );
        }

        this.pistaRepositorio = pistaRepositorio;
    }

    // Obtener las pistas desbloqueadas de una partida
    async obtenerDisponiblesPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        return await this.pistaRepositorio
            .obtenerDisponiblesPorPartida(idPartida);
    }

    // Guardar una pista en la investigación
    async guardarPista(idPartida, idPista) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (!Number.isInteger(idPista) || idPista <= 0) {
            throw new TypeError(
                'El identificador de la pista no es válido.'
            );
        }

        return await this.pistaRepositorio.guardarPista(
            idPartida,
            idPista
        );
    }

    // Obtener las pistas guardadas de una partida
    async obtenerGuardadasPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        return await this.pistaRepositorio
            .obtenerGuardadasPorPartida(idPartida);
    }
}

module.exports = PistaServicio;