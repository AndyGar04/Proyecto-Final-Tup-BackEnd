import { Turno } from "../models/turno";
import { TurnoCrud } from "../models/interface/turnoCrud"; 
import TurnoModel from "../models/implementations/mockTurno";
import { Horario } from "../models/horario";

class TurnoService implements TurnoCrud{
    getTurnos(): Promise<Array<Turno>> {
        return TurnoModel.getTurnos();
    }
    getTurno(id: string): Promise<Turno> {
        return TurnoModel.getTurno(id);
    }
    addTurno(turno: Turno): Promise<Turno> {
        return TurnoModel.addTurno(turno);
    }
    deleteTurno(id: string): void {
        TurnoModel.deleteTurno(id);
    }
    editTurno(id: string, descripcionTurno: string, costo: number): Promise<Turno> {
        return TurnoModel.editTurno(id, descripcionTurno, costo);
    }
    addHorarioATurno(id: string, nuevoHorario: Horario): Promise<Turno> {
        return TurnoModel.addHorarioATurno(id, nuevoHorario);
    }
    deleteHorarioATurno(turnoId: string, horarioId: string): Promise<Turno> {
        return TurnoModel.deleteHorarioATurno(turnoId, horarioId);
    }
    size(): number {
        return TurnoModel.size();
    }
}
export default new TurnoService();