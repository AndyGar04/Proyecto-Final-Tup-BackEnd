import { Club } from "../club";
import { ClubCrud } from "../interface/clubCrud";
import { Cancha } from "../cancha";
import { openDb } from "../../database/database";
import sqliteCancha from "./sqliteCancha"; 

export class SQLiteClub implements ClubCrud {
    
    async getClubs(): Promise<Array<Club>> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM clubs');
        const clubs: Club[] = [];

        for (const row of rows) {
            const club = new Club(row.id.toString(), row.direccion, row.nombreClub, row.telefono, row.gmail, row.valoracion);
            club.setCanchas(await this.getCanchasDeClub(row.id.toString())); 
            clubs.push(club);
        }
        return clubs;
    }

    private async getCanchasDeClub(clubId: string): Promise<Cancha[]> {
        const db = await openDb();
        const rows = await db.all('SELECT id FROM canchas WHERE clubId = ?', [clubId]);
        const canchas: Cancha[] = [];
        for (const row of rows) {
            canchas.push(await sqliteCancha.getCancha(row.id.toString()));
        }
        return canchas;
    }

    async getClub(id: string): Promise<Club> {
        const db = await openDb();
        const row = await db.get('SELECT * FROM clubs WHERE id = ?', [id]);
        if (!row) throw new Error("No existe dicho club");

        const club = new Club(row.id.toString(), row.direccion, row.nombreClub, row.telefono, row.gmail, row.valoracion);
        club.setCanchas(await this.getCanchasDeClub(id));
        return club;
    }

    async addClub(club: Club): Promise<Club> {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO clubs (direccion, nombreClub, telefono, gmail, valoracion) VALUES (?, ?, ?, ?, ?)',
            [club.getDireccion(), club.getNombreClub(), club.getTelefono(), club.getGmail(), club.getValoracion()]
        );
        club.setId(result.lastID?.toString() || "");
        return club;
    }

    async deleteClub(id: string): Promise<void> {
        const db = await openDb();
        await db.run('DELETE FROM clubs WHERE id = ?', [id]);
    }

    async editClub(id: string, direccion: string, nombreClub: string, telefono: string, gmail: string, valoracion: number): Promise<Club> {
        const db = await openDb();
        await db.run(
            'UPDATE clubs SET direccion = ?, nombreClub = ?, telefono = ?, gmail = ?, valoracion = ? WHERE id = ?',
            [direccion, nombreClub, telefono, gmail, valoracion, id]
        );
        return this.getClub(id);
    }

    async addCanchaAClub(idClub: string, nuevaCancha: Cancha): Promise<Club> {
        const db = await openDb();
        
        await db.run(
            'UPDATE canchas SET clubId = ? WHERE id = ?',
            [idClub, nuevaCancha.getId()]
        );
        
        return this.getClub(idClub);
    }

    async deleteCanchaAClub(clubId: string, canchaId: string): Promise<Club> {
        const db = await openDb();
        await db.run(
            'UPDATE canchas SET clubId = NULL WHERE id = ? AND clubId = ?',
            [canchaId, clubId]
        );
        return this.getClub(clubId);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.get('SELECT COUNT(*) as total FROM clubs');
        return result.total;
    }
}

export default new SQLiteClub();