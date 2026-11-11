
class EstrategiaValidacion {

    validar() {
        throw new Error(
            'El método validar() debe implementarse en una estrategia concreta.'
        );
    }

}

module.exports = EstrategiaValidacion;
