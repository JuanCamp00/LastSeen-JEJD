
const EstadoAcertijo = require('./EstadoAcertijo');
const AcertijoResuelto = require('./AcertijoResuelto');

class AcertijoPendiente extends EstadoAcertijo {

    constructor() {
        super('PENDIENTE');
    }

    resolver() {
        return new AcertijoResuelto();
    }

}

module.exports = AcertijoPendiente;
