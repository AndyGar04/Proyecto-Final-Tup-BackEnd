import { Horario } from "../models/horario";
// Implementacion crud usando el modelo mock
// import HorarioModel from "../models/implementations/mockHorario";
import { HorarioCrud } from "../models/interface/horarioCrud";
import SQLiteHorario from "../models/repository/sqliteHorario";

class HorarioService implements HorarioCrud{
    getHorarios(): Promise<Array<Horario>> {
        return SQLiteHorario.getHorarios();
    }
    addHorario(horario: Horario): Promise<Horario> {
        return SQLiteHorario.addHorario(horario);
    }
    addHorarios(horarios: Horario[]): Promise<void> {
        return SQLiteHorario.addHorarios(horarios);
    }
    deleteHorario(id: string): Promise<void> {
        return SQLiteHorario.deleteHorario(id);
    }
    editHorario(id: string, disponibilidad:boolean, horario: string, diaHorario: Date): Promise<Horario> {
        return SQLiteHorario.editHorario(id, disponibilidad, horario, diaHorario);
    }
    size(): Promise<number> {
        return Promise.resolve(SQLiteHorario.size());
    }
}
export default new HorarioService();