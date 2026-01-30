import { Club } from "../club";
import { ClubCrud } from "../interface/clubCrud";
import { Cancha } from "../cancha";
import { openDb } from "../../database/database";
import sqliteCancha from "./sqliteCancha"; 

export class SQLiteClub implements ClubCrud {
    
    async getClubs(): Promise<Array<Club>> {
        const db = await openDb();
        const result = await db.execute('SELECT * FROM clubs');
        const clubs: Club[] = [];

        for (const row of result.rows) {
            const club = new Club(
                String(row.id), 
                String(row.direccion), 
                String(row.nombreClub), 
                String(row.telefono), 
                String(row.gmail), 
                Number(row.valoracion)
            );
            club.setCanchas(await this.getCanchasDeClub(String(row.id))); 
            clubs.push(club);
        }
        return clubs;
    }

    private async getCanchasDeClub(clubId: string): Promise<Cancha[]> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT id FROM canchas WHERE clubId = ?',
            args: [clubId]
        });
        
        const canchas: Cancha[] = [];
        for (const row of result.rows) {
            canchas.push(await sqliteCancha.getCancha(String(row.id)));
        }
        return canchas;
    }

    async getClub(id: string): Promise<Club> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT * FROM clubs WHERE id = ?',
            args: [id]
        });

        if (result.rows.length === 0) throw new Error("No existe dicho club");
        const row = result.rows[0];
        
        if (!row) throw new Error("No existe dicho club");

        const club = new Club(
            String(row.id), 
            String(row.direccion), 
            String(row.nombreClub), 
            String(row.telefono), 
            String(row.gmail), 
            Number(row.valoracion)
        );
        club.setCanchas(await this.getCanchasDeClub(id));
        return club;
    }

    async addClub(club: Club): Promise<Club> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'INSERT INTO clubs (direccion, nombreClub, telefono, gmail, valoracion) VALUES (?, ?, ?, ?, ?)',
            args: [
                club.getDireccion(), 
                club.getNombreClub(), 
                club.getTelefono(), 
                club.getGmail(), 
                club.getValoracion()
            ]
        });
        club.setId(result.lastInsertRowid?.toString() || "");
        return club;
    }

    async deleteClub(id: string): Promise<void> {
        const db = await openDb();
        await db.execute({
            sql: 'DELETE FROM clubs WHERE id = ?',
            args: [id]
        });
    }

    async editClub(id: string, direccion: string, nombreClub: string, telefono: string, gmail: string, valoracion: number): Promise<Club> {
        const db = await openDb();
        await db.execute({
            sql: 'UPDATE clubs SET direccion = ?, nombreClub = ?, telefono = ?, gmail = ?, valoracion = ? WHERE id = ?',
            args: [direccion, nombreClub, telefono, gmail, valoracion, id]
        });
        return this.getClub(id);
    }

    async addCanchaAClub(idClub: string, nuevaCancha: Cancha): Promise<Club> {
        const db = await openDb();
        
        await db.execute({
            sql: 'UPDATE canchas SET clubId = ? WHERE id = ?',
            args: [idClub, nuevaCancha.getId()]
        });
        
        return this.getClub(idClub);
    }

    async deleteCanchaAClub(clubId: string, canchaId: string): Promise<Club> {
        const db = await openDb();
        await db.execute({
            sql: 'UPDATE canchas SET clubId = NULL WHERE id = ? AND clubId = ?',
            args: [canchaId, clubId]
        });
        return this.getClub(clubId);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.execute('SELECT COUNT(*) as total FROM clubs');
        return Number(result.rows[0]?.total) || 0;
    }
}

export default new SQLiteClub();