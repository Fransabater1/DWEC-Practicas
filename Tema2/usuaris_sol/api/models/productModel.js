import connection from "../config/db.js";

export async function getProduct() {
  const [results] = await connection.query("select * from productes");
  return results;
}

export async function postProduct(nom, quantitat, preu, descripcio, create_at) {
  const [results] = await connection.query(
    "insert into productes (nom, quantitat, preu, descripcio, create_at) values (?,?,?,?,?)",
    [nom, quantitat, preu, descripcio, create_at]
  );
  return results;
}

export async function putProduct(id, nom, quantitat, preu, descripcio) {
  const [results] = await connection.query(
    "update productes set nom = ?, quantitat = ?, preu = ?, descripcio = ?  where id = ?",
    [nom, quantitat, preu, descripcio, create_at, id]
  );
  return results;
}

export async function deleteProduct(id) {
  const [results] = await connection.query(
    "delete from productes where id = ?",
    [id]
  );
  return results;
}

export async function getUserCorreu(correu) {
  const [login] = await connection.query(
    "select contrasenya from usuaris where correu = ?",
    [correu]
  );
  return login;
}