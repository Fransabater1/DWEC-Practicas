export class Material{
    constructor(titulo, disponibles){
        this.titulo = titulo;
        this.disponibles = disponibles;
    }

    toString(){
        return `Titulo: ${this.titulo} | Disponibles: ${this.disponibles}`
    }
}