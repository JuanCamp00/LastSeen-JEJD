const Usuario = require('../../dominio/entidades/Usuario');

const ErrorAplicacion =
    require('../../infraestructura/errores/ErrorAplicacion');

class UsuarioServicio {

    constructor(usuarioRepositorio) {

        if (!usuarioRepositorio) {
    throw new ErrorAplicacion(
        'Se requiere un repositorio de usuarios.',
        {
            statusCode: 500,
            code: 'REPOSITORIO_USUARIOS_NO_CONFIGURADO'
        }
    );
}

        this.usuarioRepositorio = usuarioRepositorio;
    }

    
    // 1. REGISTRAR UN USUARIO
    

        async registrarUsuario(nombreUsuario) {

            // Crear y validar la entidad de dominio
            const usuario = new Usuario({
                nombreUsuario
            });

            // Guardar utilizando el repositorio existente
            return await this.usuarioRepositorio.guardar({
                nombreUsuario: usuario.nombreUsuario
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
