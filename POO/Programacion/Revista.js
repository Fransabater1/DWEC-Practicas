import {Material} from "./Material.js"

export class Revista extends Material{
    constructor(titulo, disponibles, fecha){
        super(titulo, disponibles);
        this.fecha = fecha;
    }

    toString(){
        return `${super.toString()} | Autor: ${this.autor} | Fecha: ${this.fecha}`;
    }
}



