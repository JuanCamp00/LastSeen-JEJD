
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class PistaRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    
    // 1. OBTENER LAS PISTAS DE UN ACERTIJO
   

    async obtenerPorAcertijo(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_pista,
                id_acertijo,
                contenido,
                orden,
                disponible_desde_inicio
            FROM pista
            WHERE id_acertijo = $1
            ORDER BY orden ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows;
    }


    // 2. OBTENER LAS PISTAS DESBLOQUEADAS
    // DE UNA PARTIDA
    

    async obtenerDisponiblesPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                p.id_pista,
                p.id_acertijo,
                p.contenido,
                p.orden,
                pp.desbloqueada_en,
                pp.guardada,
                pp.fecha_guardado
            FROM partida_pista pp
            INNER JOIN pista p
                ON p.id_pista = pp.id_pista
            WHERE pp.id_partida = $1
            ORDER BY p.id_acertijo ASC, p.orden ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }


    // 3. REGISTRAR LAS PISTAS INICIALES
  
    async registrarPistasIniciales(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            INSERT INTO partida_pista (
                id_partida,
                id_pista
            )
            SELECT
                $1,
                id_pista
            FROM pista
            WHERE disponible_desde_inicio = TRUE
            ON CONFLICT (id_partida, id_pista) DO NOTHING
            RETURNING *
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }


    
    // 4. DESBLOQUEAR LAS PISTAS DE UN ACERTIJO
   

    async desbloquearPorAcertijo(idPartida, idAcertijo) {

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

        const consulta = `
            INSERT INTO partida_pista (
                id_partida,
                id_pista
            )
            SELECT
                $1,
                id_pista
            FROM pista
            WHERE id_acertijo = $2
              AND disponible_desde_inicio = FALSE
            ON CONFLICT (id_partida, id_pista) DO NOTHING
            RETURNING *
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idAcertijo]
        );

        return resultado.rows;
    }


    
    // 5. GUARDAR UNA PISTA EN LA INVESTIGACION
   

    async guardarPista(idPartida, idPista) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        if (!Number.isInteger(idPista) || idPista <= 0) {
            throw new TypeError(
                'El identificador de la pista debe ser un entero positivo.'
            );
        }

        const consulta = `
            UPDATE partida_pista
            SET
                guardada = TRUE,
                fecha_guardado = COALESCE(
                    fecha_guardado,
                    CURRENT_TIMESTAMP
                )
            WHERE id_partida = $1
              AND id_pista = $2
            RETURNING *
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idPista]
        );

        if (resultado.rowCount === 0) {
            throw new Error(
                'La pista no está desbloqueada en esta partida.'
            );
        }

        return resultado.rows[0];
    }


    // 6. OBTENER LAS PISTAS GUARDADAS
    // DE UNA PARTIDA
    

    async obtenerGuardadasPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                p.id_pista,
                p.id_acertijo,
                p.contenido,
                p.orden,
                pp.fecha_guardado
            FROM partida_pista pp
            INNER JOIN pista p
                ON p.id_pista = pp.id_pista
            WHERE pp.id_partida = $1
              AND pp.guardada = TRUE
            ORDER BY pp.fecha_guardado ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }

}


// Exportar el repositorio
module.exports = PistaRepositorio;
