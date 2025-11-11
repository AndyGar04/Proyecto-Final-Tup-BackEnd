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
    editTurno(id: string, disponibilidad: boolean, costo: number, horario: Horario[]): Promise<Turno> {
        return TurnoModel.editTurno(id, disponibilidad, costo, horario);
    }
    confirmarTurno(id: string, disponibilidad: boolean): Promise<Turno> {
        return TurnoModel.confirmarTurno(id, disponibilidad);
    }
    size(): number {
        return TurnoModel.size();
    }
}
export default new TurnoService();