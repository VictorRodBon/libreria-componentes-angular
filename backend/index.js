import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

// Crear el pool de conexiones usando los datos de Docker
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función asíncrona para probar la conexión y hacer una consulta
async function probarConexion() {
  try {
    // Obtener una conexión del pool
    const connection = await pool.getConnection();
    console.log('¡Conectado exitosamente a MariaDB desde Node.js! 🚀');

    // Consultar los datos de la tabla usuarios que creó el init.sql
    const [rows] = await connection.query('SELECT * FROM usuarios');
    console.log('Usuarios encontrados en la base de datos:');
    console.table(rows); // Muestra los resultados en formato de tabla en la consola

    // Liberar la conexión de vuelta al pool
    connection.release();
  } catch (error) {
    console.error('Error al conectar o consultar la base de datos ❌:', error.message);
  }
}

probarConexion();
