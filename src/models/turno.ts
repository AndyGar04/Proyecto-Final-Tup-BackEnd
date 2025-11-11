import { Horario } from "./horario";

export class Turno{
    constructor(
        protected disponibilidad: boolean,
        protected costo: number,
        protected id: string,
        protected horarios: Horario[] = []
    ){}

    //Get y set disponibilidad
    public getDisponibilidad(): boolean{
        return this.disponibilidad
    }
    public setDisponibilidad(disponibilidad: boolean): void{
        this.disponibilidad = disponibilidad
    }

    //Get y set costo
    public getCosto(): number{
        return this.costo
    }
    public setCosto(costo: number): void{
        this.costo = costo
    }

    //Get y set id
    public getId(): string{
        return this.id
    }
    public setId(id: string): void{
        this.id = id
    }

    //Get y set horarios
    public getHorarios(): Horario[]{
        return this.horarios
    }
    public anadirHorario(nuevoHorario: Horario): void {
        this.horarios.push(nuevoHorario);
    }
    public setHorarios(listaHorarios: Horario[]): void{
        this.horarios.push(...listaHorarios);
    }
}