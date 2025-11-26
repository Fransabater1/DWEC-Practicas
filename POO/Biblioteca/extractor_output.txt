# 🧩 EXTRACTOR v1.0
**Ruta analizada:** F:/Segundo/DWEC-Practicas/POO/Biblioteca
**Tipo de proyecto detectado:** Docker
**Fecha:** 2025-11-11 18:09:35

---

## 🗂️ Estructura del proyecto

- 📁 Biblioteca/
  - 📄 .env
  - 📄 docker-compose.yml
  - 📁 BD/
    - 📄 base.sql
  - 📁 cliente/
    - 📄 personas.js
    - 📄 prueba.html
  - 📁 servidor/
    - 📄 conexion.js
    - 📄 package.json
    - 📄 prototipo.txt
    - 📄 server.js

---
## 📦 Contenido de archivos


### 📄 .env
```
# Variables de la Base de Datos
# Variables de la Base de Datos
MYSQL_ROOT_PASSWORD=alumno
MYSQL_DATABASE=Biblioteca
MYSQL_USER=alumno
MYSQL_PASSWORD=alumno

# Variables de la Aplicación Node.js
# El nombre "db" debe coincidir con el nombre del servicio en docker-compose.yml
DB_HOST=db
DB_USER=${MYSQL_USER}
DB_PASSWORD=${MYSQL_PASSWORD}
DB_NAME=${MYSQL_DATABASE}

# Puerto para la app de Node
APP_PORT=3000
```


### 📄 docker-compose.yml
```
name: Biblioteca-contenedor

services:
  db:
    build:
      context: ./BD
      dockerfile: dockerfile
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql

  app:
    build:
      context: ./servidor
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "${APP_PORT}:3000"
    volumes:
      - ./servidor:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      DB_HOST: db
      DB_USER: ${MYSQL_USER}
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_NAME: ${MYSQL_DATABASE}
      APP_PORT: ${APP_PORT}
    depends_on:
      - db

volumes:
  db-data:

```


### 📄 BD\base.sql
```
-- Active: 1760514927072@@127.0.0.1@3306@Biblioteca


drop database if EXISTS Biblioteca;

create database if not EXISTS Biblioteca;

use Biblioteca;



create table tipo_recurso(
    id_tipo int AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(30)
);

create table recursos(
    id_recurso int AUTO_INCREMENT PRIMARY KEY,
    titulo varchar(100),
    disponibles int,
    id_tipo int,
    Foreign Key (id_tipo) REFERENCES tipo_recurso(id_tipo)
);

create table personas (
    id_persona int AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    dni VARCHAR(15),
    tipo enum('socio','administrador')
);

create table libros(
    id_libro int PRIMARY KEY,
    autor VARCHAR(50),
    Foreign Key (id_libro) REFERENCES recursos(id_recurso)
);

create table revistas(
    id_revista int PRIMARY KEY,
    fecha_publicacion DATE,
    Foreign Key (id_revista) REFERENCES recursos(id_recurso)
);

create table peliculas (
    id_pelicula int PRIMARY KEY,
    director VARCHAR(50),
    genero VARCHAR(50),
    Foreign Key (id_pelicula) REFERENCES recursos(id_recurso)
);

create Table socios(
    id_persona int PRIMARY KEY,
    Foreign Key (id_persona) REFERENCES personas(id_persona)
);

creaTE TABLE administradores(
    id_persona int primary key,
    cargo VARCHAR(50),
    Foreign Key (id_persona) REFERENCES personas(id_persona)
);

create table prestamos(
    id_prestamo int AUTO_INCREMENT PRIMARY KEY,
    id_persona int,
    id_recurso int,
    fecha_prestamo date,
    fecha_devolucion date,
    Foreign Key (id_persona) REFERENCES personas(id_persona),
    Foreign Key (id_recurso) REFERENCES recursos(id_recurso)
);

DELIMITER //
CREATE TRIGGER bajar_disponibles
BEFORE INSERT ON prestamos
FOR EACH ROW
BEGIN
    UPDATE recursos
    SET disponibles = disponibles - 1
    WHERE id_recurso = NEW.id_recurso AND disponibles > 0;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER subir_disponibles
AFTER UPDATE ON prestamos
FOR EACH ROW
BEGIN
    IF OLD.fecha_devolucion IS NULL AND NEW.fecha_devolucion IS NOT NULL THEN
        UPDATE recursos
        SET disponibles = disponibles + 1
        WHERE id_recurso = NEW.id_recurso; 
    END IF;
END;
//
DELIMITER ;

SELECT p.id_persona, p.nombre, p.dni
    FROM personas p 
    JOIN socios s ON s.id_persona = p.id_persona

SELECT p.id_persona, p.nombre, p.dni, a.cargo
    FROM personas p 
    JOIN administradores a ON a.id_persona = p.id_persona

INSERT INTO tipo_recurso (tipo)
VALUES ('Libro'), ('Revista'), ('Película');

-- recursos
INSERT INTO recursos (titulo, disponibles, id_tipo) VALUES
('El Quijote', 3, 1),
('El Señor de los Anillos', 2, 1),
('National Geographic', 5, 2),
('Science Today', 4, 2),
('Matrix', 5, 3),
('Inception', 3, 3);

-- libros (corresponde a id_recurso 1 y 2)
INSERT INTO libros (id_libro, autor) VALUES
(1, 'Cervantes'),
(2, 'Tolkien');

-- revistas (corresponde a id_recurso 3 y 4)
INSERT INTO revistas (id_revista, fecha_publicacion) VALUES
(3, '2024-05-10'),
(4, '2024-10-01');

-- peliculas (corresponde a id_recurso 5 y 6)
INSERT INTO peliculas (id_pelicula, director, genero) VALUES
(5, 'Wachowski', 'Sci-Fi'),
(6, 'Nolan', 'Acción');

-- personas
INSERT INTO personas (nombre, dni, tipo) VALUES
('Ana López', '11111111A', 'socio'),
('Luis Pérez', '22222222B', 'socio'),
('Carlos Ruiz', '33333333C', 'administrador'),
('Marta Gil', '44444444D', 'administrador');

-- socios
INSERT INTO socios VALUES (1), (2);

-- administradores
INSERT INTO administradores VALUES
(3, 'Gestor'),
(4, 'Director');

-- prestamos (2 socios piden 4 recursos)
INSERT INTO prestamos (id_persona, id_recurso, fecha_prestamo, fecha_devolucion) VALUES
(1, 1, '2025-10-01', NULL),
(1, 3, '2025-10-03', '2025-10-10'),
(2, 2, '2025-10-02', NULL),
(2, 6, '2025-10-05', '2025-10-12');

select * from prestamos;

select * from personas
```


### 📄 cliente\personas.js
```
function vista() {
  // Obtenemos todos los elementos
  const tipo = document.getElementById("tipo");
  const seccionAdmin = document.getElementById("Admin");
  const formulario = document.getElementById("registroP");

  // Obtenemos los radios para hacerlos required o no
  const radioMaestro = document.getElementById("maestro");
  const radioAyudante = document.getElementById("ayudante");

  if (tipo.value === "administrador") {
    seccionAdmin.hidden = false;

    formulario.action = "/administrador";

    // Hacemos que los radios sean obligatorios
    radioMaestro.required = true;
    radioAyudante.required = true;
  } else {
    seccionAdmin.hidden = true;
    formulario.action = "/socio";

    // Quitamos el 'required' para que el formulario se pueda enviar
    radioMaestro.required = false;
    radioAyudante.required = false;
  }
}

const formulario = document.getElementById("registroP");

formulario.addEventListener("submit", (event) => {// Creamos la funcion para cuando se le de a enviar haga todo eso
  event.preventDefault();
  // Gaurdamos las variables que vamos a gastar
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nom").value;
  const dni = document.getElementById("dni").value;

  // Validacion

  if (nombre.trim() === "") {
    alert("Por favor, introduce tu nombre.");
    document.getElementById("nombre").focus();
    return;
  }
  if (dni.trim() === "") {
    alert("Por favor, introduce tu DNI.");
    document.getElementById("dni").focus();
    return;
  }
  if (tipo === "") {
    alert("Por favor, selecciona un tipo.");
    document.getElementById("tipo").focus();
    return;
  }
  // Creamos el json que vamos a pasar al socio
  const data = {
    nombre: nombre,
    dni: dni,
  };

  let url;

  // Si es admin tenemos que añadir al json el cargo
  if (tipo === "administrador") {
    // Guardamos la variable del radio button
    const radioSeleccionado = document.querySelector(
      'input[name="cargo"]:checked'
    );
    // validamos si esta
    if (!radioSeleccionado) {
      alert("Por favor, selecciona un cargo (Maestro o Ayudante).");
      document.getElementById("maestro").focus();
      return;
    }
    // añadimos el cargo al json
    data["cargo"] = radioSeleccionado.value;

    // url del post admin
    url = "http://localhost:3000/administrador";

  } else {
    // url del post socio
    url = "http://localhost:3000/socio";
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Error en la respuesta del servidor: " + response.statusText
        );
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Respuesta del servidor:", responseData);
      alert("¡Datos enviados con éxito!");
      form.reset();
      tipoContenedor.innerHTML = "";
    })
    .catch((error) => {
      console.error("Error al enviar el formulario:", error);
      alert(
        "Hubo un error al enviar los datos. Por favor, inténtalo de nuevo."
      );
    });
});

```


### 📄 cliente\prueba.html
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h2>Formulario de registro</h2>  
    <form id="registroP" action="/socio">
      <label for="dni">DNI:</label>
      <input type="text" name="dni" id="dni" required /><br /><br />

      <label for="nom">Nombre:</label>
      <input type="text" name="nombre" id="nom" required /><br /><br />

      <label for="tipo">Tipo:</label>
      <select name="tipo" id="tipo" onchange="vista()">
        <option value="socio">Socio</option>
        <option value="administrador">Administrador</option>
      </select>
      <br />
      <div id="Admin" hidden>
        <fieldset>
          <input type="radio" name="cargo" id="maestro" value="maestro" />
          <label for="maestro">Maestro</label>
          <br />
          <input type="radio" name="cargo" id="ayudante" value="ayudante" />
          <label for="ayudante">Ayudante</label>

          </fieldset>
      </div>
      <br />
      <button type="submit">Registrar</button>
    </form>
    <script src="personas.js"></script>
  </body>
</html>

```


### 📄 servidor\conexion.js
```
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
```


### 📄 servidor\package.json
```
{
  "name": "servidor",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "test": "nodemon server.js",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "type": "module",
  "dependencies": {
    "express": "^5.1.0",
    "mysql2": "^3.15.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}


```


### 📄 servidor\prototipo.txt
```
https://www.figma.com/design/hsSjLljnema87H9GuIlA2h/Sin-t%C3%ADtulo?m=auto&t=zFLkaTYCz3QiJSLP-1
```


### 📄 servidor\server.js
```
import express from "express";
import { con, verifyConnection } from "conexion.js";

const app = express();
const PORT = process.env.APP_PORT

async function obtenerTodosLosRecursos(){
  const [rows] = await con.query("select * from recursos");
  return rows;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manejadorDeErrores = (err, req, res, next) => {
  console.error(" ERROR DETECTADO:", err.message);
  const statusCode = err.status || 500;
  // Si el error tiene un mensaje, lo usamos.
  // Si no, ponemos un mensaje genérico.
  const message = err.message || "Error interno del servidor";
  // Enviamos la respuesta JSON centralizada
  res.status(statusCode).json({
    message: message
  });
};

app.get("/libros", async (req, res, next) => {
  try {
    const [rows] = await con.query(
      "SELECT r.id_recurso, r.titulo, r.disponibles, l.autor FROM recursos r JOIN libros l ON r.id_recurso = l.id_libro"
    );
    res.json(rows);

  } catch (error) {
    next(error);
  }
});

app.get("/libros/:id", async (req, res, next) => {
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
    next(error);
  }
});

app.get("/peliculas", async (req, res, next) => {
  try {
    const [rows] = await con.query(`
      SELECT r.id_recurso, r.titulo, r.disponibles, p.director, p.genero
        FROM recursos r 
        JOIN peliculas p ON r.id_recurso = p.id_pelicula`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/peliculas/:id", async (req, res, next) => {
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
    next(error);
  }
});

app.get("/revistas", async (req, res, next) => {
  try {
    const [rows] = await con.query(`
    SELECT r.id_recurso, r.titulo, r.disponibles, re.fecha_publicacion
    FROM recursos r 
    JOIN revistas re ON r.id_recurso = re.id_revista`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/revistas/:id", async (req, res, next) => {
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
    next(error);
  }
});
 
app.get("/recursos", async (req, res, next) => {
  try {
    const rows = await obtenerTodosLosRecursos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/socios", async (req, res, next) => {
  try {
    const [rows] = await con.query(`
    SELECT p.id_persona, p.nombre, p.dni
    FROM personas p 
    JOIN socios s ON s.id_persona = p.id_persona`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/administradores", async (req, res, next) => {
  try {
    const [rows] = await con.query(`
    SELECT p.id_persona, p.nombre, p.dni, a.cargo
    FROM personas p 
    JOIN administradores a ON a.id_persona = p.id_persona`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/administradores/:id", async (req, res, next) => {
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
    next(error);
  }
});
  

app.get("/socios/:id", async (req, res, next) => {
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
    next(error);
  }
});
 
app.get("/personas", async (req, res, next) => {
  try {
    const [rows] = await con.query(`
    select * from personas`);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});
app.get("/prestamos/:id/:socio/:recurso", async (req, res, next) => {
  try{
    const {id, socio, recurso} = req.params;
    const [rows] = await con.query(`select * from prestamos where id_prestamo = ? and id_persona = ? and id_recurso = ?`, 
      [id, socio, recurso]);
    if(rows.length === 0){
      return res.status(404).json({ message: "prestamo no encontrado"});
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

const verificarNombre = async(req, res, next) => {
  const recursos = await obtenerTodosLosRecursos();
}

app.post("/socio", verificarNombre, async (req, res, next) => {
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
    next(e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/administrador", async (req, res, next) => {
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
    next(e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/libro", async (req, res, next) => {
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
    next(e);
  } finally {
    //Siempre liberamos la cionexion al final
    if (connection) {
      connection.release();
    }
  }
});

app.post("/revista", async (req, res, next) => {
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
    next(e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.post("/pelicula", async (req, res, next) => {
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
    next(e);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.put("/libros/:id", async (req, res, next) => {
  let connection;

  try {
    //obtenemos una conexión del pool
    connection = await con.getConnection();

    const {id} = req.params;
    const { titulo, disponibles, autor } = req.body;
    // comprobem si algun camp demanat esta buit
    if (!titulo || disponibles === undefined || !autor) {
      const error = new Error("Faltan datos");
      error.status = 400;
      throw error;
    }
    //Iniciamos la transacción en esa conexion
    await connection.beginTransaction();

    //PRIMER update en recursos (usando 'connection')
    const [updateRecurso] = await connection.query(
      "UPDATE recursos SET titulo = ?, disponibles = ? WHERE id_recurso = ?",
      [titulo, disponibles, id]
    );

    // si no sa ha afectat ninguna fila tira error
    if (updateRecurso.affectedRows === 0) {
      const error = new Error("No es posible insertar el recurso (fase 1)");
      error.status = 500;
      throw error;
    }

    const [updateLibro] = await connection.query(
      "update libros set autor = ? where id_libro =?",
      [autor, id]
    );

    if (updateLibro.affectedRows === 0) {
      const error = new Error(
        "No es posible actualizar los detalles del libro (fase 2)"
      );
      error.status = 500;
      throw error;
    }

    //Si todo funciona bien, hacemos commit
    await connection.commit();

    // insert fet
    res.status(201).json({ message: "Libro actualiazdo" });
  } catch (e) {
    console.error(e);
    if (connection) {
      console.log("Haciendo rollback de la transacción...");
      await connection.rollback();
    }
    next(e);
  } finally {
    //Siempre liberamos la cionexion al final
    if (connection) {
      connection.release();
    }
  }
});

app.use(manejadorDeErrores);

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
```

---

## 🧾 Resumen final
- Archivos procesados: **9**
- Tipo de proyecto: **Docker**
- Fecha de generación: **2025-11-11 18:09:35**

---
💡 *Generado automáticamente por Extractor v1.0 — dedaniel.com*