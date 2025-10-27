import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'alumno',
  password: 'alumno',
  database: 'Biblioteca',
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