import { Club } from "../models/club";
import { ClubCrud } from "../models/interface/clubCrud";
//Implementacion de mock 
//import ClubModel from "../models/implementations/mockClub";
import SQLiteClub from "../models/repository/sqliteClub";
import { Cancha } from "../models/cancha";
import SQLiteCancha from "../models/repository/sqliteCancha";

class ClubService implements ClubCrud{
    getClubs(): Promise<Array<Club>> {
        return SQLiteClub.getClubs();
    }
    getClub(id: string): Promise<Club> {
        return SQLiteClub.getClub(id);
    }
    addClub(club: Club): Promise<Club> {
        return SQLiteClub.addClub(club);
    }
    deleteClub(id: string): void {
        SQLiteClub.deleteClub(id);
    }
    editClub(id: string, direccion: string, nombreClub:string, telefono:string, gmail:string , validacion: number): Promise<Club> {
        return SQLiteClub.editClub(id, direccion, nombreClub, telefono, gmail, validacion);
    }
    async addCanchaAClub(idClub: string, cancha: Cancha): Promise<Club> {
        await SQLiteCancha.addCancha(cancha, idClub);
        return await this.getClub(idClub);
    }
    deleteCanchaAClub(clubId: string, canchaId: string): Promise<Club> {
        return SQLiteClub.deleteCanchaAClub(clubId, canchaId);
    }
    size(): Promise<number> {
        return SQLiteClub.size();
    }
}
export default new ClubService();