
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



// CONFIGURACION DE DEPENDENCIAS

function configurarServicios() {

    // Instanciar el repositorio de usuarios
    const usuarioRepositorio = new UsuarioRepositorio(pool);

    // Crear el servicio de usuarios
    const usuarioServicio = new UsuarioServicio(
        usuarioRepositorio
    );

    // Crear el servicio de partidas
    const partidaServicio = new PartidaServicio({
        poolConexion: pool,
        UsuarioRepositorio,
        PartidaRepositorio,
        AcertijoRepositorio,
        ProgresoRepositorio,
        ContenidoRepositorio,
        PistaRepositorio
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
        acertijoServicio
    };
}



// EXPORTAR CONFIGURACION


module.exports = configurarServicios;
