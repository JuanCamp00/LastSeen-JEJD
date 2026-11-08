
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class ProgresoRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    // 1. GUARDAR O ACTUALIZAR EL PROGRESO
    

    async guardar(progreso) {

        if (!progreso || typeof progreso !== 'object') {
            throw new TypeError(
                'Se necesita la información del progreso.'
            );
        }

        const { idPartida, idAcertijoActual } = progreso;

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        if (
            idAcertijoActual !== null &&
            (!Number.isInteger(idAcertijoActual) ||
             idAcertijoActual <= 0)
        ) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo o NULL.'
            );
        }

        const consulta = `
            INSERT INTO progreso (
                id_partida,
                id_acertijo_actual,
                fecha_actualizacion
            )
            VALUES ($1, $2, CURRENT_TIMESTAMP)

            ON CONFLICT (id_partida)
            DO UPDATE SET
                id_acertijo_actual = EXCLUDED.id_acertijo_actual,
                fecha_actualizacion = CURRENT_TIMESTAMP

            RETURNING
                id_progreso,
                id_partida,
                id_acertijo_actual,
                fecha_actualizacion
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idAcertijoActual]
        );

        return resultado.rows[0];
    }


    
    // 2. BUSCAR EL PROGRESO DE UNA PARTIDA
    

    async buscarPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_progreso,
                id_partida,
                id_acertijo_actual,
                fecha_actualizacion
            FROM progreso
            WHERE id_partida = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows[0] || null;
    }

}


// Exportar el repositorio
module.exports = ProgresoRepositorio;
