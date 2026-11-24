
function validar(condicion, mensaje, TipoError = TypeError) {
    if (!condicion) {
        throw new TipoError(mensaje);
    }
}
function validarTextoObligatorio(texto, mensaje) {
    validar(
        typeof texto === 'string' && texto.trim().length > 0,
        mensaje
    );

    return texto.trim();
}

function validarLongitud(texto, maximo, mensaje) {
    validar(
        texto.length <= maximo,
        mensaje,
        Error
    );
}

class Contenido {

    constructor({
        idContenido = null,
        idAcertijoDesbloqueador = null,
        titulo,
        descripcion = null,
        tipoContenido,
        recurso
    }) {

      
        validarIdOpcional(
            idContenido,
            'El identificador del contenido debe ser positivo o NULL.'
        );

        validarIdOpcional(
            idAcertijoDesbloqueador,
            'El identificador del acertijo desbloqueador no es válido.'
        );

        const tituloNormalizado = validarTextoObligatorio(
            titulo,
            'El título del contenido es obligatorio.'
        );

        validarLongitud(
            tituloNormalizado,
            120,
            'El título no puede superar los 120 caracteres.'
        );

  
        validar(
            descripcion === null || typeof descripcion === 'string',
            'La descripción debe ser un texto o NULL.'
        );

        const tipoNormalizado = validarTextoObligatorio(
            tipoContenido,
            'El tipo de contenido es obligatorio.'
        ).toUpperCase();

        validarLongitud(
            tipoNormalizado,
            16,
            'El tipo de contenido no puede superar los 16 caracteres.'
        );

        const recursoNormalizado = validarTextoObligatorio(
            recurso,
            'La ruta del recurso es obligatoria.'
        );

        // Asignar atributos.
        Object.assign(this, {
            idContenido,
            idAcertijoDesbloqueador,
            titulo: tituloNormalizado,
            descripcion,
            tipoContenido: tipoNormalizado,
            recurso: recursoNormalizado
        });
    }
}

module.exports = Contenido;
