import { Club } from "../models/club";
import { ClubCrud } from "../models/interface/clubCrud"; 
import ClubModel from "../models/implementations/mockClub";
import { Cancha } from "../models/cancha";

class ClubService implements ClubCrud{
    getClubs(): Promise<Array<Club>> {
        return ClubModel.getClubs();
    }
    getClub(id: string): Promise<Club> {
        return ClubModel.getClub(id);
    }
    addClub(club: Club): Promise<Club> {
        return ClubModel.addClub(club);
    }
    deleteClub(id: string): void {
        ClubModel.deleteClub(id);
    }
    editClub(id: string, direccion: string, nombreClub:string, telefono:string, gmail:string , validacion: number): Promise<Club> {
        return ClubModel.editClub(id, direccion, nombreClub, telefono, gmail, validacion);
    }
    addCanchaAClub(id: string, nuevaCancha: Cancha): Promise<Club> {
        return ClubModel.addCanchaAClub(id, nuevaCancha);
    }
    deleteCanchaAClub(clubId: string, canchaId: string): Promise<Club> {
        return ClubModel.deleteCanchaAClub(clubId, canchaId);
    }
    size(): number {
        return ClubModel.size();
    }
}
export default new ClubService();