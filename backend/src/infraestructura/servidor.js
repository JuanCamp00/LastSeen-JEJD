// Cargar las variables de entorno
require('dotenv').config();

// Importar la aplicación Express
const app = require('./aplicacion');

// Definir el puerto del servidor
const PUERTO = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`Last Seen está ejecutándose en el puerto ${PUERTO}`);
});