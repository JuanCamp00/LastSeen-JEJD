
const Observador = require('./Observador');

class GestorDesbloqueos extends Observador {

    constructor({
        contenidoRepositorio,
        pistaRepositorio,
        acertijoRepositorio
    }) {

        super();

        if (
            !contenidoRepositorio ||
            typeof contenidoRepositorio.desbloquearPorAcertijo !== 'function'
        ) {
            throw new Error(
                'Se requiere un repositorio de contenidos válido.'
            );
        }

        if (
            !pistaRepositorio ||
            typeof pistaRepositorio.desbloquearPorAcertijo !== 'function'
        ) {
            throw new Error(
                'Se requiere un repositorio de pistas válido.'
            );
        }

        if (
            !acertijoRepositorio ||
            typeof acertijoRepositorio.obtenerAcertijos !== 'function'
        ) {
            throw new Error(
                'Se requiere un repositorio de acertijos válido.'
            );
        }

        this.contenidoRepositorio = contenidoRepositorio;
        this.pistaRepositorio = pistaRepositorio;
        this.acertijoRepositorio = acertijoRepositorio;
    }


   
    // RECIBIR NOTIFICACION DE UN ACERTIJO

    async actualizar(evento) {

        if (!evento || typeof evento !== 'object') {
            throw new TypeError(
                'El evento de resolución no es válido.'
            );
        }

        const { idPartida, idAcertijo, tipoEvento } = evento;

        if (!Number.isInteger(idPartida) || idPartida <= 0) {
            throw new TypeError(
                'El identificador de la partida no es válido.'
            );
        }

        if (!Number.isInteger(idAcertijo) || idAcertijo <= 0) {
            throw new TypeError(
                'El identificador del acertijo no es válido.'
            );
        }

        if (tipoEvento !== 'ACERTIJO_RESUELTO') {
            throw new Error(
                'El gestor solamente procesa eventos de acertijos resueltos.'
            );
        }


        // 1. Desbloquear los documentos asociados
        // al acertijo que acaba de resolverse.

        const contenidosDesbloqueados =
            await this.contenidoRepositorio.desbloquearPorAcertijo(
                idPartida,
                idAcertijo
            );


        // 2. Obtener los acertijos ordenados.

        const acertijos =
            await this.acertijoRepositorio.obtenerAcertijos();

        const indiceActual = acertijos.findIndex(
            acertijo => acertijo.id_acertijo === idAcertijo
        );

        if (indiceActual === -1) {
            throw new Error(
                'No se encontró el acertijo asociado al evento.'
            );
        }


        // 3. Identificar el siguiente acertijo.

        const siguienteAcertijo = acertijos[indiceActual + 1];

        let pistasDesbloqueadas = [];

        if (siguienteAcertijo) {

            // 4. Desbloquear las pistas del siguiente acertijo.

            pistasDesbloqueadas =
                await this.pistaRepositorio.desbloquearPorAcertijo(
                    idPartida,
                    siguienteAcertijo.id_acertijo
                );
        }


        // 5. Devolver un resumen de los desbloqueos.

        return {
            idPartida,
            idAcertijo,
            contenidosDesbloqueados,
            pistasDesbloqueadas,
            siguienteAcertijoId: siguienteAcertijo
                ? siguienteAcertijo.id_acertijo
                : null
        };
    }

}

module.exports = GestorDesbloqueos;
