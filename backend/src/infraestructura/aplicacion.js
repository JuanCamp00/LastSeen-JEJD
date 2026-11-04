const express = require('express');

//crear aplicacion
const app = express();

//recibir informacion de forma json
app.use(express.json());

//exportar la aplicacion
module.exports = app;