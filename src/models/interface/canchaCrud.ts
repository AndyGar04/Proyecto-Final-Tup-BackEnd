import { Turno } from "../turno";
import { Cancha } from "../cancha";

export interface CanchaCrud {
    getCanchas(): Promise<Array<Cancha>>;
    getCancha(id:string): Promise<Cancha>;
    addCancha(cancha:Cancha): Promise<Cancha>;
    deleteCancha(id:string): void;
    editCancha(id:string, nombreCancha:string, deporte:string, tamanio:string, turno: Turno):Promise<Cancha>;
    size():number;
}