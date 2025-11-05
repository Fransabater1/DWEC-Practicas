import express from "express";
import { con, verifyConnection } from "./conexion.js";

const app = express();
const PORT = process.env.APP_PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/libros", async (req, res) => {
  try {
    const [rows] = await con.query(
      "SELECT r.id_recurso, r.titulo, r.disponibles, l.autor FROM recursos r JOIN libros l ON r.id_recurso = l.id_libro"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/libros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query(
      "SELECT r.id_recurso, r.titulo, r.disponibles, l.autor FROM recursos r JOIN libros l ON r.id_recurso = l.id_libro WHERE r.id_recurso = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/peliculas", async (req, res) => {
  try {
    const [rows] = await con.query(`
      SELECT r.id_recurso, r.titulo, r.disponibles, p.director, p.genero
        FROM recursos r 
        JOIN peliculas p ON r.id_recurso = p.id_pelicula`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/peliculas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query(
      `
      SELECT r.id_recurso, r.titulo, r.disponibles, p.director, p.genero
        FROM recursos r
        JOIN peliculas p ON r.id_recurso = p.id_pelicula WHERE p.id_pelicula = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/revistas", async (req, res) => {
  try {
    const [rows] = await con.query(`
    SELECT r.id_recurso, r.titulo, r.disponibles, re.fecha_publicacion
    FROM recursos r 
    JOIN revistas re ON r.id_recurso = re.id_revista`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/revistas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await con.query(
    `
    SELECT r.id_recurso, r.titulo, r.disponibles, re.fecha_publicacion
    FROM recursos r
    JOIN revistas re ON r.id_recurso = re.id_revista WHERE re.id_revista = ?`,
    [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/recursos", async (req, res) => {
  try {
    const [rows] = await con.query(`
    select * from recursos`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/socios", async (req, res) => {
  try {
    const [rows] = await con.query(`
    SELECT p.id_persona, p.nombre, p.dni
    FROM personas p 
    JOIN socios s ON s.id_persona = p.id_persona`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/administradores", async (req, res) => {
  try {
    const [rows] = await con.query(`
    SELECT p.id_persona, p.nombre, p.dni, a.cargo
    FROM personas p 
    JOIN administradores a ON a.id_persona = p.id_persona`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/administradores/:id", async (req, res) => {
  try {
  const {id} = req.params;
  const [rows] = await con.query(`
  SELECT p.id_persona, p.nombre, p.dni, a.cargo
  FROM personas p 
  JOIN administradores a ON a.id_persona = p.id_persona where p.id_persona = ?`,[id]);
    if (rows.length === 0){
      return res.status(404).json({ message: "administrador no encontrado"});
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});
  

app.get("/socios/:id", async (req, res) => {
  try {
    const {id} = req.params;
  const [rows] = await con.query(`
  SELECT p.id_persona, p.nombre, p.dni
  FROM personas p 
  JOIN socios s ON s.id_persona = p.id_persona where p.id_persona = ?`,[id]);
    if(rows.length === 0){
      return res.status(404).json({ message: "socios no enontrado"});
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/personas", async (req, res) => {
  try {
    const [rows] = await con.query(`
    select * from personas`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/prestamos/:id/:socio/:recurso", async (req, res) => {
  try{
    const {id, socio, recurso} = req.params;
    const [rows] = await con.query(`select * from prestamos where id_prestamo = ? and id_persona = ? and id_recurso = ?`, 
      [id, socio, recurso]);
    if(rows.length === 0){
      return res.status(404).json({ message: "prestamo no encontrado"});
    }
    res.json(rows[0]);
  }catch{
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/socio", async (req, res) => {
  let connection;
  try {
    connection = await con.getConnection();
    const { nombre, dni } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!nombre || !dni) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }

    await connection.beginTransaction();

    const [insertPersona] = await connection.query(
      "insert into personas (nombre, dni, tipo) values (? ,? ,'socio')",
      [nombre, dni]
    );

    const nuevoId = insertPersona.insertId;

    // si no sa ha afectat ninguna fila tira error
    if (insertPersona.affectedRows === 0 || !nuevoId) {
      const error = new Error("No es posible insertar la persona");
      error.status = 500;
      throw error;
    }

    const [insertSocio] = await connection.query(
      "insert into socios (id_persona) values (?)",
      [nuevoId]
    );

    if (insertSocio.affectedRows === 0) {
      const error = new Error(
        "No es posible insertar en la tabla socios pero en Persona si"
      );
      error.status = 500;
      throw error;
    }

    await connection.commit();
    // insert fet
    res.status(201).json({ message: "Socio insertado" });
  } catch (e) {
    // error no controlat
    if (connection) {
      await connection.rollback();
    }
    console.error(e);
    res
      .status(e.status || 500)
      .json({ message: e.message || "Error interno del servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/administrador", async (req, res) => {
  let connection;
  try {
    connection = await con.getConnection();
    const { nombre, dni, cargo } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!nombre || !dni || !cargo) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }

    await connection.beginTransaction();

    const [insertPersona] = await connection.query(
      "insert into personas (nombre, dni, tipo) values (? ,? ,'administrador')",
      [nombre, dni]
    );

    const nuevoId = insertPersona.insertId;

    // si no sa ha afectat ninguna fila tira error
    if (insertPersona.affectedRows === 0 || !nuevoId) {
      const error = new Error("No es posible insertar la persona");
      error.status = 500;
      throw error;
    }

    const [insertAdmin] = await connection.query(
      "insert into administradores (id_persona, cargo) values (?, ?)",
      [nuevoId, cargo]
    );

    if (insertAdmin.affectedRows === 0) {
      const error = new Error(
        "No es posible insertar en la tabla administradores pero en Persona si"
      );
      error.status = 500;
      throw error;
    }

    await connection.commit();
    // insert fet
    res.status(201).json({ message: "Administrador insertado" });
  } catch (e) {
    if (connection) {
      await connection.rollback();
    }
    console.error(e);
    res
      .status(e.status || 500)
      .json({ message: e.message || "Error interno del servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/libro", async (req, res) => {
  let connection;

  try {
    //obtenemos una conexión del pool
    connection = await con.getConnection();

    const { titulo, disponibles, autor } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!titulo || !disponibles || !autor) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }
    //Iniciamos la transacción en esa conexion
    await connection.beginTransaction();

    //PRIMER INSERT (usando 'connection')
    const [insert] = await connection.query(
      "insert into recursos (titulo, disponibles, id_tipo) values (? ,? ,1)",
      [titulo, disponibles]
    );

    const nuevoId = insert.insertId;

    // si no sa ha afectat ninguna fila tira error
    if (insert.affectedRows === 0 || !nuevoId) {
      const error = new Error("No es posible insertar el recurso (fase 1)");
      error.status = 500;
      throw error;
    }

    const [insertLibros] = await connection.query(
      "insert into libros (id_libro, autor) values (?, ?)",
      [nuevoId, autor]
    );

    if (insertLibros.affectedRows === 0) {
      const error = new Error(
        "No es posible insertar los detalles del libro (fase 2)"
      );
      error.status = 500;
      throw error;
    }

    //Si todo funciona bien, hacemos commit
    await connection.commit();

    // insert fet
    res.status(201).json({ message: "Libro insertado" });
  } catch (e) {
    console.error(e);
    if (connection) {
      console.log("Haciendo rollback de la transacción...");
      await connection.rollback();
    }
    res
      .status(e.status || 500)
      .json({ message: e.message || "Error interno del servidor" });
  } finally {
    //Siempre liberamos la cionexion al final
    if (connection) {
      connection.release();
    }
  }
});

app.post("/revista", async (req, res) => {
  let connection;
  try {
    connection = await con.getConnection();
    const { titulo, disponibles, fecha } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!titulo || !disponibles || !fecha) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }

    await connection.beginTransaction();

    const [insert] = await connection.query(
      "insert into recursos (titulo, disponibles, id_tipo) values (? ,? ,2)",
      [titulo, disponibles]
    );

    const nuevoId = insert.insertId;

    // si no sa ha afectat ninguna fila tira error
    if (insert.affectedRows === 0 || !nuevoId) {
      const error = new Error("No es posible insertar el recurso");
      error.status = 500;
      throw error;
    }

    const [insertRevista] = await connection.query(
      "insert into revistas (id_revista, fecha_publicacion) values (?, ?)",
      [nuevoId, fecha]
    );

    if (insertRevista.affectedRows === 0) {
      const error = new Error("No es posible insertar los detalles de la revista");
      error.status = 500;
      throw error;
    }

    await connection.commit();
    // insert fet
    res.status(201).json({ message: "Revista insertada" });
  } catch (e) {
    if (connection) {
      await connection.rollback();
    }
    console.error(e);
    res
      .status(e.status || 500)
      .json({ message: e.message || "Error interno del servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/pelicula", async (req, res) => {
  let connection;
  try {
    connection = await con.getConnection();
    const { titulo, disponibles, genero, director } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!titulo || !disponibles || !genero || !director) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }

    await connection.beginTransaction();

    const [insert] = await connection.query(
      // He cambiado el id_tipo a 3 (asumiendo 1=libro, 2=revista)
      "insert into recursos (titulo, disponibles, id_tipo) values (? ,? ,3)",
      [titulo, disponibles]
    );

    const nuevoId = insert.insertId;

    // si no sa ha afectat ninguna fila tira error
    if (insert.affectedRows === 0 || !nuevoId) {
      const error = new Error("No es posible insertar el recurso");
      error.status = 500;
      throw error;
    }

    const [insertPelicula] = await connection.query(
      "insert into peliculas (id_pelicula, director, genero) values (?, ?, ?)",
      [nuevoId, director, genero]
    );

    if (insertPelicula.affectedRows === 0) {
      const error = new Error("No es posible insertar los detalles de la pelicula");
      error.status = 500;
      throw error;
    }

    await connection.commit();
    // insert fet
    res.status(201).json({ message: "Pelicula insertada" });
  } catch (e) {
    if (connection) {
      await connection.rollback();
    }
    console.error(e);
    res
      .status(e.status || 500)
      .json({ message: e.message || "Error interno del servidor" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

(async () => {
  try {
    await verifyConnection();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor por error en la base de datos.');
    process.exit(1);
  }
})();