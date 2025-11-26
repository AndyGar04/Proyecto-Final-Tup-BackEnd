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
    editHorario(id: string, disponibilidad:boolean, horario: string, diaHorario: Date): Promise<Horario> {
        return HorarioModel.editHorario(id, disponibilidad, horario, diaHorario);
    }
    size(): number {
        return HorarioModel.size();
    }
}
export default new HorarioService();