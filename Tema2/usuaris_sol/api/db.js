import mysql from 'mysql2/promise';


const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'users',
    password: 'root'
});

export default connection