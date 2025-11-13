import { Horario } from "./horario";

export class Turno{
    constructor(
        protected id: string,
        protected descripcionTurno: string,
        protected costo: number,
        protected horarios: Horario[] = []
    ){}

    //Get y set descripcion turno
    public getDescripcionTurno(): string{
        return this.descripcionTurno
    }
    public setDescripcionTurno(descripcionTurno: string): void{
        this.descripcionTurno = descripcionTurno
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
    
    public setHorarios(listaHorarios: Horario[]): void {
        if (!Array.isArray(listaHorarios)) {
            throw new Error("listaHorarios debe ser un arreglo válido de Horario");
        }
        this.horarios.push(...listaHorarios);
    }
}