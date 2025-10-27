-- Active: 1760514927072@@127.0.0.1@3306@Biblioteca


drop database if EXISTS Biblioteca;

create database if not EXISTS Biblioteca;

use Biblioteca;

select * from tipo_recurso;

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