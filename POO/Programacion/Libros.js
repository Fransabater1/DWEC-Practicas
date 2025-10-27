import {Material} from "./Material.js"

export class Libros extends Material{
    constructor(titulo, disponibles, autor){
        super(titulo, disponibles);
        this.autor = autor;
    }

    toString(){
        return `${super.toString()} | Autor: ${this.autor}`;
    }
    
}

