
const EstrategiaValidacion = require('./EstrategiaValidacion');

class ValidacionSeleccion extends EstrategiaValidacion {

    // Comprobar si la opción seleccionada es la correcta.

    validar(idOpcionSeleccionada, idOpcionCorrecta) {

        if (
            !Number.isInteger(idOpcionCorrecta) ||
            idOpcionCorrecta <= 0
        ) {
            throw new Error(
                'No se encontró una opción correcta válida para el acertijo.'
            );
        }

        if (
            !Number.isInteger(idOpcionSeleccionada) ||
            idOpcionSeleccionada <= 0
        ) {
            return false;
        }

        return idOpcionSeleccionada === idOpcionCorrecta;
    }

}

module.exports = ValidacionSeleccion;
