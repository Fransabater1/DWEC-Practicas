-- Active: 1764153030744@@127.0.0.1@3306@inventari_db
create database if not EXISTS inventari_db;

use inventari_db;


CREATE TABLE IF NOT EXISTS usuaris (
    id int AUTO_INCREMENT PRIMARY KEY,
    correu VARCHAR(255),
    contrasenya VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS productes (
    id int AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255),
    quantitat int,
    preu FLOAT,
    descripcio text,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into usuaris(correu, contrasenya) values ('prueba@gmail.com', 'contrasenya');
insert into productes(nom, quantitat, preu, descripcio, create_at) VALUES ('prueba', 5, 5.5, 'text', '2021-12-11');