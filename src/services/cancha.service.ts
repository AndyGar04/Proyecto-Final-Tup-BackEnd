import { Cancha } from "../models/cancha";
import { Horario } from "../models/horario";
import { Turno } from "../models/turno";
import { CanchaCrud } from "../models/interface/canchaCrud";
import CanchaModel from "../models/implementations/mockCancha"

class CanchaService implements CanchaCrud{
    getCanchas(): Promise<Array<Cancha>> {
        return CanchaModel.getCanchas();
    }
    getCancha(id: string): Promise<Cancha> {
        return CanchaModel.getCancha(id);
    }
    addCancha(cancha: Cancha): Promise<Cancha> {
        return CanchaModel.addCancha(cancha);
    }
    deleteCancha(id: string): Promise<void> {
        return CanchaModel.deleteCancha(id);
    }
    editCancha(id: string, nombreCancha: string, deporte: string, tamanio: string, turno: Turno): Promise<Cancha> {
        return CanchaModel.editCancha(id, nombreCancha, deporte, tamanio, turno);
    }
    size(): number {
        return CanchaModel.size();
    }

}

export default new  CanchaService();