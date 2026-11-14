class UsuarioControlador {

    constructor(usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }

    // Identificar un usuario existente o registrar uno nuevo
    async identificar(req, res, next) {

        try {

            const { nombreUsuario } = req.body;

            // Comprobar si el usuario ya existe
            const usuarioExistente =
                await this.usuarioServicio.obtenerUsuarioPorNombre(
                    nombreUsuario
                );

            // Si existe, devolver sus datos
            if (usuarioExistente) {
                return res.status(200).json({
                    mensaje: 'Usuario identificado correctamente.',
                    usuario: usuarioExistente
                });
            }

            // Si no existe, registrarlo
            const nuevoUsuario =
                await this.usuarioServicio.registrarUsuario(
                    nombreUsuario
                );

            return res.status(201).json({
                mensaje: 'Usuario registrado correctamente.',
                usuario: nuevoUsuario
            });

        } catch (error) {
            next(error);
        }
    }
}

// Exportar controlador
module.exports = UsuarioControlador;