import { Turno } from "./turno";

export class Cancha{
    constructor(
        protected nombreCancha: string,
        protected deporte: string,
        protected tamanio: string, //6vs6-11vs11-etc
        protected turno: Turno,
        protected id: string
    ){}

    //Get y set nombreCancha
    public getNombreCancha():string{
        return this.nombreCancha
    }
    public setNombreCancha(nombreCancha: string): void{
        this.nombreCancha = nombreCancha
    }

    //Get y set deporte
    public getDeporte():string{
        return this.deporte
    }
    public setDeporte(deporte:string):void{
        this.deporte = deporte
    }

    //Get y set tamanio
    public getTamanio():string{
        return this.tamanio
    }
    public setTamanio(tamanio:string):void{
        this.tamanio = tamanio
    }

    //Get y set tamanio
    public getTurno():Turno{
        return this.turno
    }
    public setTurno(turno:Turno):void{
        this.turno = turno
    }

    //Get y set id
    public getId(): string{
        return this.id
    }
    public setId(id: string){
        this.id = id
    }
}