import { Cancha } from "./cancha";

export class Club {
    constructor(
        protected id: string,
        protected direccion: string,
        protected nombreClub: string,
        protected telefono: string,
        protected gmail: string,
        protected valoracion: number,
        protected canchas: Cancha [] = []
    ){}

    //Get y set Direccion
    public getDireccion(): string{
        return this.direccion
    }
    public setDireccion(direccion: string): void{
        this.direccion = direccion
    }

    //Get y set nombreClub
    public getNombreClub():string{
        return this.nombreClub
    }
    public setNombreClub(nombreClub: string): void{
        this.nombreClub = nombreClub
    }
    
    //Get y set telefono
    public getTelefono():string{
        return this.telefono
    }
    public setTelefono(telefono:string):void{
        this.telefono = telefono
    }
    
    //Get y set gmail
    public getGmail():string{
        return this.gmail
    }
    public setGmail(gmail:string):void{
        this.gmail = gmail
    }
    
    //Get y set valoracion
    public getValoracion(): number{
        return this.valoracion
    }
    public setValoracion(valoracion: number): void{
        this.valoracion = valoracion
    }
    
    //Get y set id
    public getId(): string{
        return this.id
    }
    public setId(id: string){
        this.id = id
    }

    //Get y set canchas
    public getCanchas(): Cancha[]{
        return this.canchas
    }
    
    public setCanchas(listaCanchas: Cancha[]): void {
        if (!Array.isArray(listaCanchas)) {
            throw new Error("listaCanchas debe ser un arreglo válido");
        }
        this.canchas = listaCanchas; // Reemplazamos en lugar de hacer push
    }
        
    public setHorarios(listaCanchas: Cancha[]): void {
        if (!Array.isArray(listaCanchas)) {
            throw new Error("listaCanchas debe ser un arreglo válido de Horario");
        }
        this.canchas.push(...listaCanchas);
    }
}