import { Cancha } from "../cancha";
import { Club } from "../club";

export interface ClubCrud {
        getClubs(): Promise<Array<Club>>;
        getClub(id: string): Promise<Club>;
        addClub(club: Club): Promise<Club>;
        deleteClub(id: string) :void;
        editClub(id:string, direccion: string, nombreClub:string, telefono:string, gmail:string , valoracion:number):Promise<Club>;
        addCanchaAClub(id: string, nuevaCancha: Cancha): Promise<Club>;
        deleteCanchaAClub(clubId:string, canchaId:string): Promise<Club>;
        size():Promise<number>;
}