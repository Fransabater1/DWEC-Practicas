import { Personas } from "./Personas.js"

export class Socios extends Personas{
    constructor(nombre, dni, listaL){
        super(nombre, dni);
        this.listaL = [];
    }
    toString(){
        return `${super.toString()} | Recursos: ${this.listaL,length} `;
    }
}



