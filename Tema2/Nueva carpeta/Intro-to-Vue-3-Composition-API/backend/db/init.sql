-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS products;
USE products;

-- 2. Tabla 'product'
CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    color VARCHAR(100),
    image VARCHAR(255), 
    quantity INT,
    brand VARCHAR(100),
    product VARCHAR(100)
);

-- 3. Tabla 'product_details'
CREATE TABLE IF NOT EXISTS product_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_product INT,
    detail VARCHAR(255),
    FOREIGN KEY (id_product) REFERENCES product(id) ON DELETE CASCADE
);

-- 4. Datos de prueba
INSERT INTO product (color, image, quantity, brand, product) VALUES 
('green', 'socks_green.jpeg', 50, 'Vue Mastery', 'Socks'),
('blue', 'socks_blue.jpeg', 0, 'Vue Mastery', 'Socks');

INSERT INTO product_details (id_product, detail) VALUES 
(1, '50% cotton'),
(1, '30% wool'),
(1, '20% polyester');