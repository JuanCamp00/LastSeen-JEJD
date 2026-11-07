// Importar herramientas necesarias
const path = require('path');
const { Pool } = require('pg');

// Cargar las variables de entorno desde la raíz del proyecto
require('dotenv').config({
    path: path.resolve(__dirname, '../../../../.env')
});

// Configuración de la conexión
const configuracion = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

// Verificar que exista la contraseña
if (!configuracion.password) {
    throw new Error('No se encontró la variable DB_PASSWORD en el archivo .env');
}

// Crear el grupo de conexiones
const pool = new Pool(configuracion);

// Manejar errores inesperados de conexión
pool.on('error', (error) => {
    console.error('Error inesperado en PostgreSQL:', error.message);
});

// Función para comprobar la conexión
async function probarConexion() {
    const resultado = await pool.query(
        'SELECT current_database() AS base_datos'
    );

    return resultado.rows[0];
}

// Exportar el pool y la función de prueba
module.exports = {
    pool,
    probarConexion
};