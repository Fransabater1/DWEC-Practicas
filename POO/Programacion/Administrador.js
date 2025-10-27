import { Personas } from "./Personas.js"

export class Administrador extends Personas{
    constructor(nombre, dni, cargo){
        super(nombre, dni);
        this.cargo = cargo;
    }
    toString(){
        return super(this.toString);
    }
}



