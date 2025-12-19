import { Cancha } from "../models/cancha";
import { Horario } from "../models/horario";
import { Turno } from "../models/turno";
import { CanchaCrud } from "../models/interface/canchaCrud";
import SQLiteCancha from "../models/repository/sqliteCancha";
//Implementacion de mock
//import CanchaModel from "../models/implementations/mockCancha"


class CanchaService implements CanchaCrud{
    getCanchas(): Promise<Array<Cancha>> {
        return SQLiteCancha.getCanchas();
    }
    getCancha(id: string): Promise<Cancha> {
        return SQLiteCancha.getCancha(id);
    }
    addCancha(cancha: Cancha): Promise<Cancha> {
        return SQLiteCancha.addCancha(cancha);
    }
    deleteCancha(id: string): Promise<void> {
        return SQLiteCancha.deleteCancha(id);
    }
    editCancha(id: string, nombreCancha: string, deporte: string, tamanio: string, turno: Turno): Promise<Cancha> {
        return SQLiteCancha.editCancha(id, nombreCancha, deporte, tamanio, turno);
    }
    size(): Promise<number> {
        return Promise.resolve(SQLiteCancha.size());
    }

}

export default new  CanchaService();