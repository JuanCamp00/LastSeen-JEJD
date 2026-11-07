
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class UsuarioRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

   
    // 1. GUARDAR UN NUEVO USUARIO
   

    async guardar(usuario) {

        if (!usuario || typeof usuario !== 'object') {
            throw new TypeError(
                'Se necesita la información del usuario.'
            );
        }

        const nombreUsuario = usuario.nombreUsuario;

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

        const consulta = `
            INSERT INTO usuario (
                nombre_usuario
            )
            VALUES ($1)
            RETURNING
                id_usuario,
                nombre_usuario
        `;

        try {

            const resultado = await this.pool.query(
                consulta,
                [nombreNormalizado]
            );

            return resultado.rows[0];

        } catch (error) {

            // Código PostgreSQL 23505: violación de UNIQUE
            if (error.code === '23505') {
                throw new Error(
                    'El nombre de usuario ya está registrado.'
                );
            }

            throw error;
        }
    }


    // 2. BUSCAR UN USUARIO POR SU ID
   

    async buscarPorId(idUsuario) {

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_usuario,
                nombre_usuario
            FROM usuario
            WHERE id_usuario = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idUsuario]
        );

        return resultado.rows[0] || null;
    }


    
    // 3. BUSCAR UN USUARIO POR SU NOMBRE
    

    async buscarPorNombre(nombreUsuario) {

        if (
            typeof nombreUsuario !== 'string' ||
            nombreUsuario.trim().length === 0
        ) {
            throw new TypeError(
                'El nombre del usuario es obligatorio.'
            );
        }

        const nombreNormalizado = nombreUsuario.trim();

        const consulta = `
            SELECT
                id_usuario,
                nombre_usuario
            FROM usuario
            WHERE nombre_usuario = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [nombreNormalizado]
        );

        return resultado.rows[0] || null;
    }

}


// Exportar el repositorio
module.exports = UsuarioRepositorio;
