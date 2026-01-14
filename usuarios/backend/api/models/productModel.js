import connection from "../config/db.js";

export async function getProduct() {
  const [results] = await connection.query("select * from productes");
  return results;
}

export async function deleteProduct(id) {
  const [results] = await connection.query("delete from productes where id = ?", [id]);
  return results;
}

export async function postProduct(nom, quantitat, preu, descripcio) {
  const [results] = await connection.query(
    "insert into productes (nom, quantitat, preu, descripcio) values (?, ?, ?, ?)",
    [nom, quantitat, preu, descripcio]
  );
  return results;
}

export async function putProduct(nom, quantitat, preu, descripcio, id) {
  const [results] = await connection.query(
    "update productes set nom = ?, quantitat = ?, preu = ?, descripcio = ? where id = ?",
    [nom, quantitat, preu, descripcio, id]
  );
  return results;
}
