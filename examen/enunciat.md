# Examen de Programació Full-Stack: Gestió d'Inventari

**Durada**: 2 hores  
**Tecnologies**: Node/Express, MySQL, Vue.js, Cookies, JWT, Axios

---

## Part 1: Backend (Node/Express + MySQL) – **Valor: 60 punts**

### Tasca 1: Creació d'un servidor Node.js amb Express – **(10 punts)**

- Configura un servidor Node.js amb Express.
- Crea una base de dades **MySQL** anomenada `inventari_db` amb una taula `productes` amb els camps: `id`, `nom`, `quantitat`, `preu`, `descripcio`, `created_at`.

### Tasca 2: Rutes de l'API per gestionar productes – **(20 punts)**

- **Ruta de creació de producte** (`POST /api/productes`) – **(5 punts)**: Afegeix un producte a la base de dades.
- **Ruta per obtenir tots els productes** (`GET /api/productes`) – **(5 punts)**: Retorna tots els productes emmagatzemats a la base de dades.
- **Ruta per actualitzar un producte** (`PUT /api/productes/:id`) – **(5 punts)**: Permet actualitzar un producte existent.
- **Ruta per eliminar un producte** (`DELETE /api/productes/:id`) – **(5 punts)**: Permet eliminar un producte.

### Tasca 3: Rutes de login i autenticació amb JWT – **(15 punts)**

- **Ruta de login** (`POST /api/login`) – **(10 punts)**: Aquesta ruta ha de rebre un correu electrònic i contrasenya i retornar un **JWT**. El token es desa a les cookies.
- **Protecció de les rutes amb JWT** – **(5 punts)**: Les rutes de creació, actualització i eliminació de productes han de ser protegides amb JWT (obtenint el token des de les cookies).

### Tasca 4: Protecció de les rutes amb JWT – **(15 punts)**

- Comprovar que les rutes de creació, actualització i eliminació de productes són segures i només accessibles amb un JWT vàlid en les cookies.

---

## Part 2: Frontend (Vue.js) – **Valor: 40 punts**

### Tasca 1: Configura l'entorn Vue.js – **(10 punts)**

- Crea una nova aplicació Vue.js.
- Organitza l'estructura del projecte amb components Vue per a les pantalles: **Llista de productes**, **Afegir producte**, **Editar producte**, **Eliminar producte**.

### Tasca 2: Comunicació amb l'API del backend utilitzant Axios – **(20 punts)**

- **Login** – **(5 punts)**: Formulari de login que envia les credencials (nom d'usuari i contrasenya) i desa el JWT a les cookies.
- **Llistat de productes** – **(5 punts)**: Realitza una petició **GET** a `/api/productes` per obtenir i mostrar els productes.
- **Afegir producte** – **(5 punts)**: Formulari per afegir productes. A l'enviar, realitza una petició **POST** a `/api/productes`.
- **Editar producte** – **(5 punts)**: Formulari per editar un producte existent i enviar una petició **PUT** a `/api/productes/:id`.
- **Eliminar producte** – **(5 punts)**: Permet eliminar un producte amb una petició **DELETE** a `/api/productes/:id`.

### Tasca 3: Proves al backend – **(10 punts)**

- Demostra mitjançant captures de pantalla que el backend funciona.

---

## Requisits generals

- **Estil de codi**: Organització i claredat del codi. (10 punts)
- **Documentació**: Comentaris breus per explicar les parts clau del codi. (5 punts)
- **Seguretat**: Ús correcte de JWT per protegir les rutes i gestionar el token a les cookies. (10 punts)

---

## Avaluació

Els alumnes seran avaluats en base als següents criteris:

- **Implementació funcional del backend**: Creació de rutes per gestionar productes amb protecció de JWT i emmagatzematge del token a les cookies.
- **Implementació del frontend en Vue.js**: Creació de components i comunicació amb l'API del backe
