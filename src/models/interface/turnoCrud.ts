import { Horario } from "../horario";
import { Turno } from "../turno";

export interface TurnoCrud {
    getTurnos():Promise<Array<Turno>>;
    getTurno(id:string):Promise<Turno>;
    addTurno(turno:Turno):Promise<Turno>;
    deleteTurno(id:string):void;
    editTurno(id:string, descripcionTurno: string, costo:number):Promise<Turno>;
    addHorarioATurno(id: string, nuevoHorario: Horario): Promise<Turno>;
    deleteHorarioATurno(turnoId:string, horarioId:string): Promise<Turno>;
    size():Promise<number>;
}