import { Horario } from "../models/horario";
import { HorarioCrud } from "../models/interface/horarioCrud"; 
import HorarioModel from "../models/implementations/mockHorario";

class HorarioService implements HorarioCrud{
    getHorarios(): Promise<Array<Horario>> {
        return HorarioModel.getHorarios();
    }
    addHorario(horario: Horario): Promise<Horario> {
        return HorarioModel.addHorario(horario);
    }
    addHorarios(horarios: Horario[]): Promise<void> {
        return HorarioModel.addHorarios(horarios);
    }
    deleteHorario(id: string): Promise<void> {
        return HorarioModel.deleteHorario(id);
    }
    editHorario(id: string, descripcionTurno: string, horario: string): Promise<Horario> {
        return HorarioModel.editHorario(id, descripcionTurno, horario);
    }
    size(): number {
        return HorarioModel.size();
    }
}
export default new HorarioService();