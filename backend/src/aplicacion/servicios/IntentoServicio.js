const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class IntentoServicio {

    constructor(intentoRepositorio) {

        if (!intentoRepositorio) {
    throw new ErrorAplicacion(
        'Se requiere un repositorio de intentos.',
        {
            statusCode: 500,
            code: 'REPOSITORIO_INTENTOS_NO_CONFIGURADO'
        }
    );
}

        this.intentoRepositorio = intentoRepositorio;
    }

    // Consultar todos los intentos de una partida
    async obtenerPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        return await this.intentoRepositorio.buscarPorPartida(
            idPartida
        );
    }

    // Consultar un intento por su identificador
    async obtenerPorId(idIntento) {

        if (!Number.isInteger(idIntento) || idIntento <= 0) {
            throw new TypeError(
                'El identificador del intento no es válido.'
            );
        }

        const intento =
            await this.intentoRepositorio.buscarPorId(idIntento);

       if (!intento) {
    throw new ErrorAplicacion(
        'No se encontró el intento solicitado.',
        {
            statusCode: 404,
            code: 'INTENTO_NO_ENCONTRADO'
        }
    );
}

        return intento;
    }
}

module.exports = IntentoServicio;