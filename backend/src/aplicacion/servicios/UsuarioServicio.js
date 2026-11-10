
class UsuarioServicio {

    constructor(usuarioRepositorio) {

        if (!usuarioRepositorio) {
            throw new Error(
                'Se requiere un repositorio de usuarios.'
            );
        }

        this.usuarioRepositorio = usuarioRepositorio;
    }

    
    // 1. REGISTRAR UN USUARIO
    

    async registrarUsuario(nombreUsuario) {

        if (
            typeof nombreUsuario !== 'string' ||
            nombreUsuario.trim().length === 0
        ) {
            throw new TypeError(
                'El nombre de usuario es obligatorio.'
            );
        }

        const nombreNormalizado = nombreUsuario.trim();

        if (nombreNormalizado.length > 40) {
            throw new Error(
                'El nombre de usuario no puede superar los 40 caracteres.'
            );
        }

        return await this.usuarioRepositorio.guardar({
            nombreUsuario: nombreNormalizado
        });
    }


    // 2. OBTENER USUARIO POR ID
    

    async obtenerUsuarioPorId(idUsuario) {

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        return await this.usuarioRepositorio.buscarPorId(idUsuario);
    }


    
    // 3. OBTENER USUARIO POR NOMBRE
    
    async obtenerUsuarioPorNombre(nombreUsuario) {

        if (
            typeof nombreUsuario !== 'string' ||
            nombreUsuario.trim().length === 0
        ) {
            throw new TypeError(
                'El nombre de usuario es obligatorio.'
            );
        }

        return await this.usuarioRepositorio.buscarPorNombre(
            nombreUsuario.trim()
        );
    }

}


// Exportar el servicio
module.exports = UsuarioServicio;
