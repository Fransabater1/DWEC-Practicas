// import connection from '../config/db.js';

// // GET
// export async function getUser() {
//     const [results] = await connection.query(
//         'SELECT name, role FROM users'
//     );
//     return results;
// }

// // LOGIN


// // POST
// export async function insertUser(name, hashedPassword, role) {
//     const [results] = await connection.query(
//         'INSERT INTO users(name, password, role) VALUES(?, ?, ?)',
//         [name, hashedPassword, role]
//     );
//     return results;
// }