
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');
const ErrorAplicacion = require('../../infraestructura/errores/ErrorAplicacion');

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

            if (typeof estado !== 'string' || estado.trim().length === 0) {
            throw new TypeError('El estado del acertijo debe ser un texto válido.');
            }

            const estadoNormalizado = estado.trim().toUpperCase();

            const estadosPermitidos = ['PENDIENTE', 'RESUELTO'];

            if (!estadosPermitidos.includes(estadoNormalizado)) {
                throw new TypeError('El estado del acertijo no es válido.');
            }

        const consulta = `
           
        UPDATE partida_acertijo
        SET
        estado = $3,
        fecha_resolucion = CASE
        WHEN $4 THEN CURRENT_TIMESTAMP
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
    [
        idPartida,
        idAcertijo,
        estadoNormalizado,
        estadoNormalizado === 'RESUELTO'
    ]
);

        if (resultado.rowCount === 0) {
            throw new ErrorAplicacion(
                 'No se encontró el acertijo asociado a esa partida.',
        {
            statusCode: 404,
            code: 'ACERTIJO_NO_ASOCIADO_A_PARTIDA'
        }
    );
}

        return resultado.rows[0];
    }


   
    // ASOCIAR TODOS LOS ACERTIJOS A UNA PARTIDA
   

    async asociarTodosALaPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            INSERT INTO partida_acertijo (
                id_partida,
                id_acertijo
            )
            SELECT
                $1,
                id_acertijo
            FROM acertijo
            ON CONFLICT (id_partida, id_acertijo) DO NOTHING
            RETURNING
                id_partida,
                id_acertijo,
                estado,
                fecha_resolucion
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }

    // OBTENER EL ID DE LA OPCION CORRECTA


    async obtenerOpcionCorrecta(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT id_opcion
            FROM opcion_acertijo
            WHERE id_acertijo = $1
              AND es_correcta = TRUE
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows[0] || null;
    }


    
    // CONSULTAR EL ESTADO DE UN ACERTIJO
    // DENTRO DE UNA PARTIDA
    

    async buscarEstadoEnPartida(idPartida, idAcertijo) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser positivo.'
            );
        }

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser positivo.'
            );
        }

        const consulta = `
            SELECT
                id_partida,
                id_acertijo,
                estado,
                fecha_resolucion
            FROM partida_acertijo
            WHERE id_partida = $1
              AND id_acertijo = $2
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idAcertijo]
        );

        return resultado.rows[0] || null;
    }


}


// Exportar el repositorio
module.exports = AcertijoRepositorio;