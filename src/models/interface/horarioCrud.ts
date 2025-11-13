import { Horario } from "../horario";

export interface HorarioCrud {
    getHorarios():Promise<Array<Horario>>;
    addHorario(horario:Horario):Promise<Horario>;
    addHorarios(horarios: Horario[]):Promise<void>;
    deleteHorario(id:string):void;
    editHorario(id:string, disponibilidad: boolean, horario: string):Promise<Horario>;
    size():number;
}