
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class AcertijoRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    async obtenerAcertijos() {

        const consulta = `
            SELECT
                id_acertijo,
                pregunta,
                orden,
                tipo_validacion,
                respuesta_correcta_texto
            FROM acertijo
            ORDER BY orden ASC
        `;

        const resultado = await this.pool.query(consulta);

        return resultado.rows;
    }


  

    async buscarPorId(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_acertijo,
                pregunta,
                orden,
                tipo_validacion,
                respuesta_correcta_texto
            FROM acertijo
            WHERE id_acertijo = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows[0] || null;
    }




    async obtenerOpcionesPorAcertijo(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_opcion,
                id_acertijo,
                texto_opcion,
                orden
            FROM opcion_acertijo
            WHERE id_acertijo = $1
            ORDER BY orden ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows;
    }


 

    async actualizarEstado(idPartida, idAcertijo, estado) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const estadoNormalizado = String(estado).toUpperCase();

        const estadosPermitidos = ['PENDIENTE', 'RESUELTO'];

        if (!estadosPermitidos.includes(estadoNormalizado)) {
            throw new Error('El estado del acertijo no es válido.');
        }

        const consulta = `
            UPDATE partida_acertijo
            SET
                estado = $3,
                fecha_resolucion = CASE
                    WHEN $3 = 'RESUELTO' THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            WHERE id_partida = $1
              AND id_acertijo = $2
            RETURNING
                id_partida,
                id_acertijo,
                estado,
                fecha_resolucion
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idAcertijo, estadoNormalizado]
        );

        if (resultado.rowCount === 0) {
            throw new Error(
                'No se encontró el acertijo asociado a esa partida.'
            );
        }

        return resultado.rows[0];
    }

}


// Exportar el repositorio
module.exports = AcertijoRepositorio;