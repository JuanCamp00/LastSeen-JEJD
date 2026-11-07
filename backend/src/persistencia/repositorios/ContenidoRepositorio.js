
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class ContenidoRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    
    // 1. BUSCAR UN CONTENIDO POR SU ID
    

    async buscarPorId(idContenido) {

        if (!Number.isInteger(idContenido) || idContenido <= 0) {
            throw new TypeError(
                'El identificador del contenido debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_contenido,
                id_acertijo_desbloqueador,
                titulo,
                descripcion,
                tipo_contenido,
                recurso
            FROM contenido
            WHERE id_contenido = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idContenido]
        );

        return resultado.rows[0] || null;
    }


    
    // 2. BUSCAR CONTENIDOS ASOCIADOS A UN ACERTIJO
    
    async buscarPorAcertijo(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_contenido,
                id_acertijo_desbloqueador,
                titulo,
                descripcion,
                tipo_contenido,
                recurso
            FROM contenido
            WHERE id_acertijo_desbloqueador = $1
            ORDER BY id_contenido ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows;
    }


    
    // 3. OBTENER CONTENIDOS DISPONIBLES
    // PARA UNA PARTIDA
    

    async obtenerPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                c.id_contenido,
                c.id_acertijo_desbloqueador,
                c.titulo,
                c.descripcion,
                c.tipo_contenido,
                c.recurso,
                pc.desbloqueado_en
            FROM partida_contenido pc
            INNER JOIN contenido c
                ON c.id_contenido = pc.id_contenido
            WHERE pc.id_partida = $1
            ORDER BY pc.desbloqueado_en ASC,
                     c.id_contenido ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }


    // 4. REGISTRAR CONTENIDOS DISPONIBLES
    // DESDE EL INICIO DE UNA PARTIDA
   

    async registrarContenidosIniciales(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            INSERT INTO partida_contenido (
                id_partida,
                id_contenido,
                desbloqueado_en
            )
            SELECT
                $1,
                c.id_contenido,
                CURRENT_TIMESTAMP
            FROM contenido c
            WHERE c.id_acertijo_desbloqueador IS NULL
            ON CONFLICT (id_partida, id_contenido) DO NOTHING
            RETURNING
                id_partida,
                id_contenido,
                desbloqueado_en
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }


    
    // 5. DESBLOQUEAR CONTENIDOS AL RESOLVER
    // UN ACERTIJO
    

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
            INSERT INTO partida_contenido (
                id_partida,
                id_contenido,
                desbloqueado_en
            )
            SELECT
                $1,
                c.id_contenido,
                CURRENT_TIMESTAMP
            FROM contenido c
            WHERE c.id_acertijo_desbloqueador = $2
            ON CONFLICT (id_partida, id_contenido) DO NOTHING
            RETURNING
                id_partida,
                id_contenido,
                desbloqueado_en
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida, idAcertijo]
        );

        return resultado.rows;
    }

}


// Exportar el repositorio
module.exports = ContenidoRepositorio;
