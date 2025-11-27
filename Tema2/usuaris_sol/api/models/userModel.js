import connection from '../config/db.js';

// GET
export async function getAllUsersQuery() {
    const [results] = await connection.query(
        'SELECT name, role FROM users'
    );
    return results;
}

// LOGIN
export async function getUserByNameQuery(name) {
    const [login] = await connection.query(
        "select role, password from users where name = ?", [name]
    );
    return login;
}

// POST
export async function insertUserQuery(name, hashedPassword, role) {
    const [results] = await connection.query(
        'INSERT INTO users(name, password, role) VALUES(?, ?, ?)',
        [name, hashedPassword, role]
    );
    return results;
}