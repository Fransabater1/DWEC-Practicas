export class Personas{
    constructor(nombre, dni){
        this.nombre = nombre;
        this.dni = dni;
    }

    toString(){
        return `Nombre: ${this.nombre} | DNI: ${dni}`;
    }
}