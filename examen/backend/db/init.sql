create database if not EXISTS inventari_db;

use inventari_db;

create table if not exists productes (
    id int AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    quantitat int,
    preu FLOAT,
    descripcio text,
    create_at TIMESTAMP
);

CREATE Table if NOT exists usuaris (
    id int AUTO_INCREMENT PRIMARY KEY,
    correu VARCHAR(255) not null UNIQUE,
    contrasenya VARCHAR(255) not null
);

