
function validar(condicion, mensaje, TipoError = TypeError) {
    if (!condicion) {
        throw new TipoError(mensaje);
    }
}

function validarIdOpcional(idUsuario) {
    validar(
        idUsuario === null ||
        (Number.isInteger(idUsuario) && idUsuario > 0),
        'El identificador del usuario debe ser un entero positivo o NULL.'
    );
}

function validarNombre(nombreUsuario) {
    validar(
        typeof nombreUsuario === 'string' &&
        nombreUsuario.trim().length > 0,
        'El nombre del usuario es obligatorio.'
    );

    const nombreNormalizado = nombreUsuario.trim();
    

    return nombreNormalizado;
}

class Usuario {
    constructor({
        idUsuario = null,
        nombreUsuario
    }) {
        validarIdOpcional(idUsuario);

        const nombreNormalizado = validarNombre(nombreUsuario);

        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreNormalizado;
    }
}

module.exports = Usuario;
