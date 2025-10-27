import { Administrador } from "./Administrador.js";
import { Libros } from "./Libros.js";
import { Pelicula } from "./Pelicula.js";
import { Revista } from "./Revista.js";
import { Socios } from "./Socios.js";
import readline from "readline";
import { Personas } from "./Personas.js";
import { Material } from "./Material.js";
import { normalize } from "path";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function preguntar(pregunta) {
    return new Promise((resolve) =>
        rl.question(pregunta + " ", (r) => resolve(r.trim()))
    );
}

const libro1 = new Libros("Wiggeta", "Willyrex", 20);
const pelicula1 = new Pelicula("Seven", "David Fincher", "drama", 5);
const revista1 = new Revista("Playboy", "11-07-2025", 22);
const socio1 = new Socios("Paco", "20964073X");
const adm1 = new Administrador("Juan", "20432175X", "Administrador");

let opcion = 0;
let socios = [];
let admins = [];
let pelis = [];
let libros = [];
let revistas = [];

do {
    await menu();
} while (opcion != 12);

async function menu() {
    console.log("Menu");
    console.log("1. Añadir Libro");
    console.log("2. Añadir revista");
    console.log("3. Añadir una pelicula");
    console.log("4. Añadir un socio");
    console.log("5. Añadir un admin");
    console.log("6. Prestar servicio");
    console.log("7. Devolver libro");
    console.log("8. Lista de recursos");
    console.log("9. Lista de socios");
    console.log("10. Lista de admins");
    console.log("11. Lista de recuros de socios");
    console.log("12. Salir");
    opcion = await preguntar("Elige una opcion: ");

    switch (opcion) {
        case "1":
            let tit = await preguntar("Introduce titulo");
            let dispo = await preguntar("Introduce los ejemplares disponibles: ");
            let aut = await preguntar("Introduce el autor: ");
            let libroCreado = crearLibro(tit, dispo, aut);
            libros.push(libroCreado);
            break;

        case "2":
            let titu = await preguntar("Introduce titulo");
            let dispon = await preguntar("Introduce los ejemplares disponibles: ");
            let fecha = await preguntar("Introduce la fecha: ");
            let revistaCreada = crearRevista(titu, dispon, fecha);
            revistas.push(revistaCreada);
            break;

        case "3":
            let titulo = await preguntar("Introduce titulo");
            let disponi = await preguntar("Introduce los ejemplares disponibles: ");
            let dir = await preguntar("Introduce el director: ");
            let gen = await preguntar("Introduce el genero: ");
            let peliCreada = crearPelicua(titulo, disponi, dir, gen);
            pelis.push(peliCreada);
            break;

        case "4":
            let nom = await preguntar("Nombre: ");
            let dni = await preguntar("DNI: ");
            let socioCreado = crearSocio(nom, dni);
            socios.push(socioCreado);
            break;

        case "5":
            let nomb = await preguntar("Nombre: ");
            let DNI = await preguntar("DNI: ");
            let cargo = await preguntar("Cargo: ");
            let adminCreado = await crearAdmin(nomb, DNI, cargo);
            admins.push(adminCreado);
            break;

        case "6":
            let preg = await preguntar("1-Libro / 2-Pelicula / 3-Revista: ");
            let p = await validaSocio();

            if (!p) {
                console.log("Socio no válido. Intente de nuevo.");
                break;
            }

            

            if (preg === "1") {
                let m_nombre = await preguntar("Introduce el nombre del material: ");
                let materialEncontrado;
                materialEncontrado = libros.find((libro) => libro.titulo === m_nombre);
            } else if (preg === "2") {
                let m_nombre = await preguntar("Introduce el nombre del material: ");
                let materialEncontrado;
                materialEncontrado = pelis.find((peli) => peli.titulo === m_nombre);
            } else if (preg === "3") {
                let m_nombre = await preguntar("Introduce el nombre del material: ");
                let materialEncontrado;
                materialEncontrado = revistas.find(
                    (revista) => revista.titulo === m_nombre
                );
            } else {
                console.log("El servicio no existe");
                break;
            }

            if (materialEncontrado) {
                Prestar(materialEncontrado, p);
            } else {
                console.log("Material no encontrado.");
            }
            break;

        case "7":
            let socioParaDevolver = await validaSocio();
            if (socioParaDevolver) {
                let tituloLibro = await preguntar(
                    "Introduce el título del libro a devolver: "
                );
                let libroParaDevolver = libros.find(
                    (libro) => libro.titulo === tituloLibro
                );
                if (libroParaDevolver) {
                    Devolver(socioParaDevolver, libroParaDevolver);
                } else {
                    console.log("El libro no se encuentra en nuestra base de datos.");
                }
            }
            break;

        case "8":
            mostrarRecursos();
            break;
        case "9":
            mostrarSocios();
            break;

        case "10":
            mostrarAdministrador();
            break;

        case "11":
            let socioRecursos = await validaSocio();
            if (socioRecursos) {
                mostrarRecursosS(socioRecursos);
            }
            break;
    }
}

function Prestar(m, p) {
    if (m.disponibles <= 0) {
        console.log("No quedan disponibles");
    } else if (p.listaL.length >= 3) {
        console.log("Has superado el limite de libros prestados");
    } else {
        p.listaL.push(m);
        m.disponibles--;
        console.log("Libro agregador correctamente");
    }
}

function Devolver(s, l) {
    let libroDevuelto = false;

    for (let i = 0; i < s.listaL.length; i++) {
        if (s.listaL[i] === l) {
            s.listaL.splice(i, 1);
            l.disponibles++;
            console.log("Libro devuelto exitosamente");
            libroDevuelto = true;
            break;
        }
    }
    if (!libroDevuelto) {
        console.log("El usuario no tiene ese libro");
    }
}

function mostrarSocios() {
    for (let i = 0; i < socios.length; i++) {
        console.log(socios[i] + " ");
    }
}

function mostrarAdministrador() {
    for (let i = 0; i < admins.length; i++) {
        console.log(admins[i] + " ");
    }
}

function mostrarRecursosS(socio) {
    if (socio.listaL.length === 0) {
        console.log("El socio no tiene recursos prestados.");
        return;
    }
    for (let i = 0; i < socio.listaL.length; i++) {
        console.log(socio.listaL[i] + " ");
    }
}

async function validaSocio() {
    let dni = await preguntar("Dime tu dni: ");
    for (let i = 0; i < socios.length; i++) {
        if (dni == socios[i].dni) {
            return socios[i];
        }
    }
    console.log("No se encuentra el socio");
    return undefined;
}

function mostrarRecursos() {
    console.log("Libros");
    for (let i = 0; i < libros.length; i++) {
        console.log(libros[i] + " ");
    }
    console.log("Peliculas");
    for (let i = 0; i < pelis.length; i++) {
        console.log(pelis[i] + " ");
    }
    console.log("Revistas");
    for (let i = 0; i < revistas.length; i++) {
        console.log(revistas[i] + " ");
    }
}

function crearPelicua(titulo, disponi, dir, gen) {
    let nuevaPeli = new Pelicula(titulo, disponi, dir, gen);
    return nuevaPeli;
}

function crearAdmin(nom, dni, cargo) {
    let nuevoAdmin = new Administrador(nom, dni, cargo);
    return nuevoAdmin;
}

function crearRevista(tit, dispo, fecha) {
    let nuevaRevista = new Revista(tit, dispo, fecha);
    return nuevaRevista;
}

function crearSocio(nom, dni) {
    let nuevoSocio = new Socios(nom, dni);
    return nuevoSocio;
}

function crearLibro(tit, dispo, aut) {
    let nuevoLibro = new Libros(tit, dispo, aut);
    return nuevoLibro;
}
