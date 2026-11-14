
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

const ErrorAplicacion = require('../../infraestructura/errores/ErrorAplicacion');

class PartidaRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    
    // 1. GUARDAR UNA NUEVA PARTIDA
   

    async guardar(partida) {

        if (!partida || typeof partida !== 'object') {
            throw new TypeError(
                'Se necesita la información de la partida.'
            );
        }

        const { idUsuario } = partida;

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        // Una partida nueva comienza en curso por defecto.
        const estado = partida.estado
            ? String(partida.estado).toUpperCase()
            : 'EN_CURSO';

        const estadosPermitidos = [
            'PENDIENTE',
            'EN_CURSO',
            'FINALIZADA'
        ];

        if (!estadosPermitidos.includes(estado)) {
                throw new TypeError(
                    'El estado de la partida no es válido.'
    );
        }

        const consulta = `
            INSERT INTO partida (
                id_usuario,
                estado
            )
            VALUES ($1, $2)
            RETURNING
                id_partida,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                tiempo_total_segundos,
                estado
        `;

        const resultado = await this.pool.query(
            consulta,
            [idUsuario, estado]
        );

        return resultado.rows[0];
    }


    // 2. BUSCAR UNA PARTIDA POR SU ID
    
    async buscarPorId(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_partida,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                tiempo_total_segundos,
                estado
            FROM partida
            WHERE id_partida = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows[0] || null;
    }


    
    // 3. BUSCAR PARTIDAS DE UN USUARIO
    

    async buscarPorUsuario(idUsuario) {

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new TypeError(
                'El identificador del usuario debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_partida,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                tiempo_total_segundos,
                estado
            FROM partida
            WHERE id_usuario = $1
            ORDER BY fecha_inicio DESC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idUsuario]
        );

        return resultado.rows;
    }


    
    // 4. FINALIZAR UNA PARTIDA
    

    async finalizar(idPartida, tiempoTotalSegundos) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        if (
            !Number.isInteger(tiempoTotalSegundos) ||
            tiempoTotalSegundos < 0
        ) {
            throw new TypeError(
                'El tiempo total debe ser un entero mayor o igual a cero.'
            );
        }

        const consulta = `
            UPDATE partida
            SET
                fecha_fin = CURRENT_TIMESTAMP,
                tiempo_total_segundos = $2,
                estado = 'FINALIZADA'
            WHERE id_partida = $1
              AND estado <> 'FINALIZADA'
            RETURNING
                id_partida,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                tiempo_total_segundos,
                estado
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, tiempoTotalSegundos]
        );

        if (resultado.rowCount === 0) {
            throw new ErrorAplicacion(
                'No se encontró una partida activa con ese identificador.',
                {
                    statusCode: 409,
                    code: 'PARTIDA_NO_ACTIVA'
                }
            );
        }

        return resultado.rows[0];
    }

}


// Exportar el repositorio
module.exports = PartidaRepositorio;
