class Usuario {

    constructor({
        idUsuario = null,
        nombreUsuario
    }) {

        // Validar identificador
        if (
            idUsuario !== null &&
            (!Number.isInteger(idUsuario) || idUsuario <= 0)
        ) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo o NULL.'
            );
        }

        // Validar nombre
        if (
            typeof nombreUsuario !== 'string' ||
            nombreUsuario.trim().length === 0
        ) {
            throw new TypeError(
                'El nombre del usuario es obligatorio.'
            );
        }

        const nombreNormalizado = nombreUsuario.trim();

        if (nombreNormalizado.length > 40) {
            throw new Error(
                'El nombre del usuario no puede superar los 40 caracteres.'
            );
        }

        // Asignar atributos
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreNormalizado;
    }
}

module.exports = Usuario;