import { Turno } from "../models/turno";
import { TurnoCrud } from "../models/interface/turnoCrud";
//Implementacion con mock 
//import TurnoModel from "../models/implementations/mockTurno";
import SQLiteTurno from "../models/repository/sqliteTurno";
import { Horario } from "../models/horario";

class TurnoService implements TurnoCrud{
    getTurnos(): Promise<Array<Turno>> {
        return SQLiteTurno.getTurnos();
    }
    getTurno(id: string): Promise<Turno> {
        return SQLiteTurno.getTurno(id);
    }
    addTurno(turno: Turno): Promise<Turno> {
        return SQLiteTurno.addTurno(turno);
    }
    deleteTurno(id: string): void {
        SQLiteTurno.deleteTurno(id);
    }
    editTurno(id: string, descripcionTurno: string, costo: number): Promise<Turno> {
        return SQLiteTurno.editTurno(id, descripcionTurno, costo);
    }
    addHorarioATurno(id: string, nuevoHorario: Horario): Promise<Turno> {
        return SQLiteTurno.addHorarioATurno(id, nuevoHorario);
    }
    deleteHorarioATurno(turnoId: string, horarioId: string): Promise<Turno> {
        return SQLiteTurno.deleteHorarioATurno(turnoId, horarioId);
    }
    size(): Promise<number> {
        return SQLiteTurno.size();
    }
}
export default new TurnoService();