
const EstadoAcertijo = require('./EstadoAcertijo');

class AcertijoResuelto extends EstadoAcertijo {

    constructor() {
        super('RESUELTO');
    }

   
    resolver() {
        throw new Error(
            'Este acertijo ya fue resuelto.'
        );
    }

}

module.exports = AcertijoResuelto;
