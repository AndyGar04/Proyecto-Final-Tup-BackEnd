import { Cancha } from "../cancha";
import { CanchaCrud } from "../interface/canchaCrud";
import { openDb } from "../../database/database";
import sqliteTurno from "./sqliteTurno";

export class SQLiteCancha implements CanchaCrud {
    
    async getCanchas(): Promise<Array<Cancha>> {
        const db = await openDb();
        const result = await db.execute('SELECT * FROM canchas');
        const canchas: Cancha[] = [];

        for (const row of result.rows) {
            const turno = await sqliteTurno.getTurno(String(row.turnoId));
            canchas.push(new Cancha(
                String(row.id), 
                String(row.nombreCancha), 
                String(row.deporte), 
                String(row.tamanio), 
                turno));
        }
        return canchas;
    }

    async getCancha(id: string): Promise<Cancha> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT * FROM canchas WHERE id = ?',
            args: [id]
        });
        
        if (result.rows.length === 0) throw new Error("No existe dicha cancha");
        
        const row = result.rows[0] as any;
        if (!row) throw new Error("No existe dicha cancha");
        const turno = await sqliteTurno.getTurno(String(row.turnoId));
        return new Cancha(
            String(row.id), 
            String(row.nombreCancha), 
            String(row.deporte), 
            String(row.tamanio), 
            turno
        );
    }

    async addCancha(cancha: Cancha, clubId: string): Promise<Cancha> {
        const db = await openDb();
        
        const result = await db.execute({
            sql: 'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
            args: [
                cancha.getNombreCancha(), 
                cancha.getDeporte(), 
                cancha.getTamanio(), 
                cancha.getTurno().getId(),
                clubId
            ]
        });
        
        cancha.setId(result.lastInsertRowid?.toString() || "");
        return cancha;
    }

    async addCanchaAClub(cancha: Cancha, clubId: string): Promise<Cancha> {
        return this.addCancha(cancha, clubId);
    }

    async deleteCancha(id: string): Promise<void> {
        const db = await openDb();
        await db.execute({
            sql: 'DELETE FROM canchas WHERE id = ?',
            args: [id]
        });
    }

    async editCancha(id: string, nombreCancha: string, deporte: string, tamanio: string, turno: any): Promise<Cancha> {
        const db = await openDb();
        const turnoId = (typeof turno === 'object') ? turno.getId() : turno;

        await db.execute({
            sql: 'UPDATE canchas SET nombreCancha = ?, deporte = ?, tamanio = ?, turnoId = ? WHERE id = ?',
            args: [nombreCancha, deporte, tamanio, turnoId, id]
        });
        return this.getCancha(id);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.execute('SELECT COUNT(*) as total FROM canchas');
        return Number(result.rows[0]?.total) || 0;
    }
}

export default new SQLiteCancha();