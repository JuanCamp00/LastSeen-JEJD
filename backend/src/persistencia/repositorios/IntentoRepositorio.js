
const {
    pool
} = require('../../infraestructura/conexion/conexionPostgreSQL');

class IntentoRepositorio {

    constructor(poolConexion = pool) {
        this.pool = poolConexion;
    }

    
    // 1. REGISTRAR UN INTENTO
   
    async guardar(intento) {

        if (!intento || typeof intento !== 'object') {
            throw new TypeError('Se necesita un objeto de intento.');
        }

        const {
            idPartida,
            idAcertijo,
            respuestaTexto = null,
            idOpcionSeleccionada = null,
            resultado
        } = intento;

        // Validar identificadores
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

        // Validar resultado
        const resultadoNormalizado = String(resultado).toUpperCase();

        const resultadosPermitidos = [
            'CORRECTO',
            'INCORRECTO'
        ];

        if (!resultadosPermitidos.includes(resultadoNormalizado)) {
            throw new Error('El resultado del intento no es válido.');
        }

        // Comprobar que solo se envíe una modalidad de respuesta
        const tieneTexto =
            typeof respuestaTexto === 'string' &&
            respuestaTexto.trim().length > 0;

        const tieneOpcion =
            Number.isInteger(idOpcionSeleccionada) &&
            idOpcionSeleccionada > 0;

        if (tieneTexto === tieneOpcion) {
            throw new Error(
                'El intento debe contener una respuesta de texto o una opción seleccionada, pero no ambas.'
            );
        }

        const respuestaTextoFinal = tieneTexto
            ? respuestaTexto.trim()
            : null;

        const idOpcionFinal = tieneOpcion
            ? idOpcionSeleccionada
            : null;

        const consulta = `
            INSERT INTO intento (
                id_partida,
                id_acertijo,
                fecha_intento,
                respuesta_texto,
                id_opcion_seleccionada,
                resultado
            )
            VALUES (
                $1,
                $2,
                CURRENT_TIMESTAMP,
                $3,
                $4,
                $5
            )
            RETURNING
                id_intento,
                id_partida,
                id_acertijo,
                fecha_intento,
                respuesta_texto,
                id_opcion_seleccionada,
                resultado
        `;

        const valores = [
            idPartida,
            idAcertijo,
            respuestaTextoFinal,
            idOpcionFinal,
            resultadoNormalizado
        ];

        const resultadoConsulta = await this.pool.query(
            consulta,
            valores
        );

        return resultadoConsulta.rows[0];
    }


    
    // 2. BUSCAR UN INTENTO POR SU ID
    

    async buscarPorId(idIntento) {

        if (!Number.isInteger(idIntento) || idIntento <= 0) {
            throw new TypeError(
                'El identificador del intento debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_intento,
                id_partida,
                id_acertijo,
                fecha_intento,
                respuesta_texto,
                id_opcion_seleccionada,
                resultado
            FROM intento
            WHERE id_intento = $1
        `;

        const resultado = await this.pool.query(
            consulta,
            [idIntento]
        );

        return resultado.rows[0] || null;
    }


    
    // 3. BUSCAR INTENTOS DE UNA PARTIDA
   

    async buscarPorPartida(idPartida) {

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_intento,
                id_partida,
                id_acertijo,
                fecha_intento,
                respuesta_texto,
                id_opcion_seleccionada,
                resultado
            FROM intento
            WHERE id_partida = $1
            ORDER BY fecha_intento ASC, id_intento ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idPartida]
        );

        return resultado.rows;
    }


    // 4. BUSCAR INTENTOS DE UN ACERTIJO
    

    async buscarPorAcertijo(idAcertijo) {

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo debe ser un entero positivo.'
            );
        }

        const consulta = `
            SELECT
                id_intento,
                id_partida,
                id_acertijo,
                fecha_intento,
                respuesta_texto,
                id_opcion_seleccionada,
                resultado
            FROM intento
            WHERE id_acertijo = $1
            ORDER BY fecha_intento ASC, id_intento ASC
        `;

        const resultado = await this.pool.query(
            consulta,
            [idAcertijo]
        );

        return resultado.rows;
    }

}


// Exportar el repositorio
module.exports = IntentoRepositorio;
