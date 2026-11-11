
class EstadoAcertijo {

    constructor(nombreEstado) {

        if (new.target === EstadoAcertijo) {
            throw new Error(
                'EstadoAcertijo es una clase base y no debe instanciarse directamente.'
            );
        }

        this.nombreEstado = nombreEstado;
    }


    // TRANSICION DE ESTADO
  
    resolver() {

        throw new Error(
            'El método resolver() debe implementarse en el estado concreto.'
        );
    }


    // CONSULTAR SI ESTA RESUELTO
  

    estaResuelto() {

        return this.nombreEstado === 'RESUELTO';
    }


   
    // OBTENER EL NOMBRE DEL ESTADO

    obtenerNombre() {

        return this.nombreEstado;
    }

}


module.exports = EstadoAcertijo;
