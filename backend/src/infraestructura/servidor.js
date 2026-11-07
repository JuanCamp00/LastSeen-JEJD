// Importar la aplicación Express
const app = require('./aplicacion');

// Importar la conexión con PostgreSQL
const {
    pool,
    probarConexion
} = require('./conexion/conexionPostgreSQL');

// Definir el puerto del servidor
const PUERTO = Number(process.env.PORT) || 3000;

// Iniciar el servidor
async function iniciarServidor() {
    try {
        // Comprobar la conexión con PostgreSQL
        const resultado = await probarConexion();

        console.log(
            `Conexión establecida con la base de datos: ${resultado.base_datos}`
        );

        // Iniciar Express después de comprobar la conexión
        app.listen(PUERTO, () => {
            console.log(
                `Last Seen está ejecutándose en el puerto ${PUERTO}`
            );
        });

    } catch (error) {
        console.error('No se pudo iniciar Last Seen:', error.message);

        await pool.end();

        process.exitCode = 1;
    }
}

// Ejecutar el servidor
iniciarServidor();