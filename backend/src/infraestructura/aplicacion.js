// Importar Express
const express = require('express');

// Configuración de servicios
const configurarServicios =
    require('../aplicacion/configuracionServicios');

// Controlador y rutas de usuarios
const UsuarioControlador =
    require('../presentacion/controladores/usuarioControlador');

const PartidaControlador =
    require('../presentacion/controladores/partidaControlador');

const crearPartidaRutas =
    require('../presentacion/rutas/partidaRutas');

const crearUsuarioRutas =
    require('../presentacion/rutas/usuarioRutas');

const AcertijoControlador =
    require('../presentacion/controladores/acertijoControlador');

const crearAcertijoRutas =
    require('../presentacion/rutas/acertijoRutas');

const PistaControlador =
    require('../presentacion/controladores/pistaControlador');

const crearPistaRutas =
    require('../presentacion/rutas/pistaRutas');

const ContenidoControlador =
    require('../presentacion/controladores/contenidoControlador');

const crearContenidoRutas =
    require('../presentacion/rutas/contenidoRutas');

// Controlador y rutas de intentos
const IntentoControlador =
    require('../presentacion/controladores/intentoControlador');

const crearIntentoRutas =
    require('../presentacion/rutas/intentoRutas');    

// Controlador y rutas de progreso
const ProgresoControlador =
    require('../presentacion/controladores/progresoControlador');

const crearProgresoRutas =
    require('../presentacion/rutas/progresoRutas');


// Crear la aplicación
const app = express();

// Configurar los servicios
const {
    usuarioServicio,
    partidaServicio,
    acertijoServicio,
    pistaServicio,
    contenidoServicio,
    intentoServicio,
    progresoServicio
} = configurarServicios();

// Crear el controlador
const usuarioControlador =
    new UsuarioControlador(usuarioServicio);

const partidaControlador =
    new PartidaControlador(partidaServicio);    

const acertijoControlador =
    new AcertijoControlador(acertijoServicio);

const pistaControlador =
    new PistaControlador(pistaServicio);

const contenidoControlador =
    new ContenidoControlador(contenidoServicio);

const intentoControlador =
    new IntentoControlador(intentoServicio);
    
const progresoControlador =
    new ProgresoControlador(progresoServicio);

// Recibir información en formato JSON
app.use(express.json());

// Registrar rutas de usuarios
app.use(
    '/api/usuarios',
    crearUsuarioRutas(usuarioControlador)
);

// Registrar rutas de partidas
app.use(
    '/api/partidas',
    crearPartidaRutas(partidaControlador)
);

// Registrar rutas de acertijos
app.use(
    '/api/acertijos',
    crearAcertijoRutas(acertijoControlador)
);

// Registrar rutas de pistas
app.use(
    '/api/pistas',
    crearPistaRutas(pistaControlador)
);

// Registrar rutas de contenidos
app.use(
    '/api/contenidos',
    crearContenidoRutas(contenidoControlador)
);

// Registrar rutas de intentos
app.use(
    '/api/intentos',
    crearIntentoRutas(intentoControlador)
);

// Registrar rutas de progreso
app.use(
    '/api/progreso',
    crearProgresoRutas(progresoControlador)
);

// Ruta para comprobar que la API funciona
app.get('/api/salud', (req, res) => {
    res.status(200).json({
        estado: 'OK',
        mensaje: 'La API de Last Seen está funcionando.'
    });
});

// Exportar la aplicación
module.exports = app;