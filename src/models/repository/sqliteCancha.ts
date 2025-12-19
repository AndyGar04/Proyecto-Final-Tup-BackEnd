import { Cancha } from "../cancha";
import { CanchaCrud } from "../interface/canchaCrud";
import { openDb } from "../../database/database";
import sqliteTurno from "./sqliteTurno";

export class SQLiteCancha implements CanchaCrud {
    
    async getCanchas(): Promise<Array<Cancha>> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM canchas');
        const canchas: Cancha[] = [];

        for (const row of rows) {
            const turno = await sqliteTurno.getTurno(row.turnoId.toString());
            canchas.push(new Cancha(row.id.toString(), row.nombreCancha, row.deporte, row.tamanio, turno));
        }
        return canchas;
    }

    async getCancha(id: string): Promise<Cancha> {
        const db = await openDb();
        const row = await db.get('SELECT * FROM canchas WHERE id = ?', [id]);
        if (!row) throw new Error("No existe dicha cancha");

        const turno = await sqliteTurno.getTurno(row.turnoId.toString());
        return new Cancha(row.id.toString(), row.nombreCancha, row.deporte, row.tamanio, turno);
    }

    async addCancha(cancha: Cancha): Promise<Cancha> {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId) VALUES (?, ?, ?, ?)',
            [cancha.getNombreCancha(), cancha.getDeporte(), cancha.getTamanio(), cancha.getTurno().getId()]
        );
        cancha.setId(result.lastID?.toString() || "");
        return cancha;
    }

    async deleteCancha(id: string): Promise<void> {
        const db = await openDb();
        await db.run('DELETE FROM canchas WHERE id = ?', [id]);
    }

    async editCancha(id: string, nombreCancha: string, deporte: string, tamanio: string, turno: any): Promise<Cancha> {
        const db = await openDb();
        const turnoId = (typeof turno === 'object') ? turno.getId() : turno;

        await db.run(
            'UPDATE canchas SET nombreCancha = ?, deporte = ?, tamanio = ?, turnoId = ? WHERE id = ?',
            [nombreCancha, deporte, tamanio, turnoId, id]
        );
        return this.getCancha(id);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.get('SELECT COUNT(*) as total FROM canchas');
        return result.total;
    }
}

export default new SQLiteCancha();