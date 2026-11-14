class ErrorAplicacion extends Error {

    constructor(
        mensaje,
        {
            statusCode = 500,
            code = null
        } = {}
    ) {

        super(mensaje);

        if (
            !Number.isInteger(statusCode) ||
            statusCode < 400 ||
            statusCode > 599
        ) {
            throw new TypeError(
                'El código HTTP del error no es válido.'
            );
        }

        this.name = 'ErrorAplicacion';
        this.statusCode = statusCode;
        this.isOperational = true;

        if (code !== null) {
            this.code = code;
        }

        Error.captureStackTrace?.(this, ErrorAplicacion);
    }
}

module.exports = ErrorAplicacion;