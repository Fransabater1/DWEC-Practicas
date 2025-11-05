import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,     // Esto valdrá 'db'
  user: process.env.DB_USER,     // Esto valdrá 'alumno'
  password: process.env.DB_PASSWORD, // Esto valdrá 'alumno'
  database: process.env.DB_NAME,   // Esto valdrá 'Biblioteca'
  port: 3306,
});

export async function verifyConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 as ok');
    console.log('Conexion establecida con exito');
    return true;
  } catch (err) {
    console.error('Error conectando a la base de datos:', err.message);
    throw err;
  }
}

export const con = pool;