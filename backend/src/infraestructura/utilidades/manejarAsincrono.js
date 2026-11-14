function manejarAsincrono(controlador) {

    if (typeof controlador !== 'function') {
        throw new TypeError(
            'Se requiere una función controladora.'
        );
    }

    return function (req, res, next) {

        Promise.resolve()
            .then(() => controlador(req, res, next))
            .catch(next);

    };
}

module.exports = manejarAsincrono;