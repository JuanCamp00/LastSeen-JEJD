const Pista = require('../../dominio/entidades/Pista');

const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class PistaServicio {


    // Validar y convertir una fila en una entidad Pista
_mapearPista(fila) {

    const pista = new Pista({
        idPista: fila.id_pista,
        idAcertijo: fila.id_acertijo,
        contenido: fila.contenido,
        orden: fila.orden,
        disponibleDesdeInicio: fila.disponible_desde_inicio
    });

    // Conservar los campos originales que utiliza el frontend
    return {
        ...fila,
        id_pista: pista.idPista,
        id_acertijo: pista.idAcertijo,
        contenido: pista.contenido,
        orden: pista.orden,
        disponible_desde_inicio: pista.disponibleDesdeInicio
    };
}

                constructor(pistaRepositorio) {
            if (!pistaRepositorio) {
                throw new ErrorAplicacion(
                    'Se requiere un repositorio de pistas.',
                    {
                        statusCode: 500,
                        code: 'REPOSITORIO_PISTAS_NO_CONFIGURADO'
                    }
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
            const pistas =
                await this.pistaRepositorio.obtenerDisponiblesPorPartida(
                    idPartida
                );

            return pistas.map(fila => this._mapearPista(fila));
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

                const pistas =
            await this.pistaRepositorio.obtenerGuardadasPorPartida(
                idPartida
            );

        return pistas.map(fila => this._mapearPista(fila));
    }
}

module.exports = PistaServicio;