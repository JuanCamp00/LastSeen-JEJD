const EstadoPartida = require('../enumeraciones/EstadoPartida');


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

function validarFecha(fecha, nombre) {
    if (fecha === null) {
        return null;
    }

    const fechaNormalizada = new Date(fecha);

    validar(
        !Number.isNaN(fechaNormalizada.getTime()),
        `La ${nombre} de la partida no es válida.`
    );

    return fechaNormalizada;
}
function validarEstado(estado) {
    const estadoNormalizado = String(estado).trim().toUpperCase();

    validar(
        Object.values(EstadoPartida).includes(estadoNormalizado),
        'El estado de la partida no es válido.',
        Error
    );

    return estadoNormalizado;
}

function validarTiempoTotal(tiempo) {
    validar(
        tiempo === null ||
        (Number.isInteger(tiempo) && tiempo >= 0),
        'El tiempo total debe ser un entero mayor o igual a cero.'
    );
}

class Partida {
    constructor({
        idPartida = null,
        idUsuario,
        fechaInicio = null,
        fechaFin = null,
        tiempoTotalSegundos = null,
        estado = EstadoPartida.EN_CURSO
    }) {
        validar(
            idPartida === null ||
            (Number.isInteger(idPartida) && idPartida > 0),
            'El identificador de la partida debe ser positivo o NULL.'
        );

        validarIdentificador(
            idUsuario,
            'El identificador del usuario debe ser un entero positivo.'
        );

        const inicioNormalizado = validarFecha(
            fechaInicio,
            'fecha de inicio'
        );

        const finNormalizado = validarFecha(
            fechaFin,
            'fecha de finalización'
        );

        validarTiempoTotal(tiempoTotalSegundos);

        const estadoNormalizado = validarEstado(estado);

        this.idPartida = idPartida;
        this.idUsuario = idUsuario;
        this.fechaInicio = inicioNormalizado;
        this.fechaFin = finNormalizado;
        this.tiempoTotalSegundos = tiempoTotalSegundos;
        this.estado = estadoNormalizado;
    }
}

module.exports = Partida;