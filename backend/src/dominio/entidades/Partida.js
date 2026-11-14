const EstadoPartida = require('../enumeraciones/EstadoPartida');

class Partida {

    constructor({
        idPartida = null,
        idUsuario,
        fechaInicio = null,
        fechaFin = null,
        tiempoTotalSegundos = null,
        estado = EstadoPartida.EN_CURSO
    }) {

        // Validar identificador de partida
        if (
            idPartida !== null &&
            (!Number.isInteger(idPartida) || idPartida <= 0)
        ) {
            throw new TypeError(
                'El identificador de la partida debe ser positivo o NULL.'
            );
        }

        // Validar usuario asociado
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        // Validar fechas
        const validarFecha = (fecha, nombre) => {

            if (fecha === null) {
                return null;
            }

            const fechaNormalizada = new Date(fecha);

            if (Number.isNaN(fechaNormalizada.getTime())) {
                throw new TypeError(
                    `La ${nombre} de la partida no es válida.`
                );
            }

            return fechaNormalizada;
        };

        const inicioNormalizado =
            validarFecha(fechaInicio, 'fecha de inicio');

        const finNormalizado =
            validarFecha(fechaFin, 'fecha de finalización');

        // Validar tiempo total
        if (
            tiempoTotalSegundos !== null &&
            (
                !Number.isInteger(tiempoTotalSegundos) ||
                tiempoTotalSegundos < 0
            )
        ) {
            throw new TypeError(
                'El tiempo total debe ser un entero mayor o igual a cero.'
            );
        }

        // Validar estado
        const estadoNormalizado = String(estado).trim().toUpperCase();

        if (!Object.values(EstadoPartida).includes(estadoNormalizado)) {
            throw new Error(
                'El estado de la partida no es válido.'
            );
        }

        // Asignar atributos
        this.idPartida = idPartida;
        this.idUsuario = idUsuario;
        this.fechaInicio = inicioNormalizado;
        this.fechaFin = finNormalizado;
        this.tiempoTotalSegundos = tiempoTotalSegundos;
        this.estado = estadoNormalizado;
    }
}

module.exports = Partida;