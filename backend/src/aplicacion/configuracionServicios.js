
const {
    pool
} = require('../infraestructura/conexion/conexionPostgreSQL');


// REPOSITORIOS


const UsuarioRepositorio = require(
    '../persistencia/repositorios/UsuarioRepositorio'
);

const PartidaRepositorio = require(
    '../persistencia/repositorios/PartidaRepositorio'
);

const AcertijoRepositorio = require(
    '../persistencia/repositorios/AcertijoRepositorio'
);

const ProgresoRepositorio = require(
    '../persistencia/repositorios/ProgresoRepositorio'
);

const ContenidoRepositorio = require(
    '../persistencia/repositorios/ContenidoRepositorio'
);

const PistaRepositorio = require(
    '../persistencia/repositorios/PistaRepositorio'
);

const IntentoRepositorio = require(
    '../persistencia/repositorios/IntentoRepositorio'
);




// SERVICIOS


const UsuarioServicio = require('./servicios/UsuarioServicio');

const PartidaServicio = require('./servicios/PartidaServicio');

const AcertijoServicio = require('./servicios/AcertijoServicio');

const PistaServicio = require('./servicios/PistaServicio');


const ContenidoServicio = require('./servicios/ContenidoServicio');

const IntentoServicio = require('./servicios/IntentoServicio');

const ProgresoServicio = require('./servicios/ProgresoServicio');


// CONFIGURACION DE DEPENDENCIAS

function configurarServicios() {

    // Instanciar el repositorio de usuarios
    const usuarioRepositorio = new UsuarioRepositorio(pool);

    // Crear el servicio de usuarios
    const usuarioServicio = new UsuarioServicio(
        usuarioRepositorio
    );

    const pistaRepositorio = new PistaRepositorio(pool);

    const pistaServicio = new PistaServicio(
    pistaRepositorio
    
    );

        // Crear el repositorio de contenidos
    const contenidoRepositorio =
        new ContenidoRepositorio(pool);

    // Crear el servicio de contenidos
    const contenidoServicio =
        new ContenidoServicio(contenidoRepositorio);


    // Crear el repositorio de intentos
const intentoRepositorio =
    new IntentoRepositorio(pool);

// Crear el servicio de intentos
const intentoServicio =
    new IntentoServicio(intentoRepositorio);

    // Crear el repositorio de progreso
const progresoRepositorio =
    new ProgresoRepositorio(pool);

// Crear el servicio de progreso
const progresoServicio =
    new ProgresoServicio(progresoRepositorio);

    // Crear el servicio de partidas
    const partidaServicio = new PartidaServicio({
        poolConexion: pool,
        UsuarioRepositorio,
        PartidaRepositorio,
        AcertijoRepositorio,
        ProgresoRepositorio,
        ContenidoRepositorio,
        PistaRepositorio,
    
    });

    // Crear el servicio de acertijos
            const acertijoServicio = new AcertijoServicio({
            poolConexion: pool,
            PartidaRepositorio,
            AcertijoRepositorio,
            IntentoRepositorio,
            ProgresoRepositorio,
            ContenidoRepositorio,
            PistaRepositorio
        });

    // Devolver los servicios configurados
      return {
    usuarioServicio,
    partidaServicio,
    acertijoServicio,
    pistaServicio,
    contenidoServicio,
    intentoServicio,
    progresoServicio
};

}

// EXPORTAR CONFIGURACION


module.exports = configurarServicios;
