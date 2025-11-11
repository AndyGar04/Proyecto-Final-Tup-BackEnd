import { Horario } from "../horario";
import { Turno } from "../turno";

export interface TurnoCrud {
    getTurnos():Promise<Array<Turno>>;
    getTurno(id:string):Promise<Turno>;
    addTurno(turno:Turno):Promise<Turno>;
    deleteTurno(id:string):void;
    editTurno(id:string, disponibilidad:boolean, costo:number, horario: Horario[]):Promise<Turno>;
    confirmarTurno(id:string, disponibilidad:boolean):Promise<Turno>;
    size():number;
}