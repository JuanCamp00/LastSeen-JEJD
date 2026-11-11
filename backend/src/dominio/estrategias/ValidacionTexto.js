
const EstrategiaValidacion = require('./EstrategiaValidacion');

class ValidacionTexto extends EstrategiaValidacion {

    // Normalizar el texto para evitar diferencias
    // por mayúsculas, acentos y puntuación.

    normalizar(texto) {

        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLocaleLowerCase('es')
            .replace(/[.,;:!?¿¡'"()[\]{}\-–—]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }


    // Validar una respuesta escrita

    validar(respuesta, respuestaCorrecta) {

        if (typeof respuestaCorrecta !== 'string' ||
            respuestaCorrecta.trim().length === 0) {

            throw new Error(
                'El acertijo no tiene una respuesta de referencia válida.'
            );
        }

        if (typeof respuesta !== 'string') {
            return false;
        }

        return this.normalizar(respuesta) ===
               this.normalizar(respuestaCorrecta);
    }

}

module.exports = ValidacionTexto;
