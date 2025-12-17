import { Horario } from "../horario";
import { HorarioCrud } from "../interface/horarioCrud";
import { openDb } from "../../database/database";
import e from "express";

export class SQLiteHorario implements HorarioCrud {
    
    async getHorarios(): Promise<Array<Horario>> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM horarios');
        return rows.map((r: { id: { toString: () => string; }; disponibilidad: any; horario: string; diaHorario: string | number | Date; }) => new Horario(r.id.toString(), Boolean(r.disponibilidad), r.horario, new Date(r.diaHorario)));
    }

    async addHorario(horario: Horario): Promise<Horario> {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO horarios (disponibilidad, horario, diaHorario) VALUES (?, ?, ?)',
            [horario.getDisponibilidad(), horario.getHorario(), horario.getDiaHorario().toISOString()]
        );
        
        // Seteamos el ID que generó SQLite automáticamente
        horario.setId(result.lastID?.toString() || ""); 
        return horario;
    }

    async deleteHorario(id: string): Promise<void> {
        const db = await openDb();
        const result = await db.run('DELETE FROM horarios WHERE id = ?', [id]);
        if (result.changes === 0) {
            throw new Error("No existe un Horario con ese id");
        }
    }

    async editHorario(id: string, disponibilidad: boolean, horario: string, diaHorario: Date): Promise<Horario> {
        const db = await openDb();
        
        const fechaParaDB = (diaHorario instanceof Date) ? diaHorario : new Date(diaHorario);

        await db.run(
            'UPDATE horarios SET disponibilidad = ?, horario = ?, diaHorario = ? WHERE id = ?',
            [
                disponibilidad ? 1 : 0, 
                horario, 
                fechaParaDB.toISOString(),
                id
            ]
        );
        return new Horario(id, disponibilidad, horario, fechaParaDB);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.get('SELECT COUNT(*) as total FROM horarios');
        return result.total;
    }

    async addHorarios(horarios: Horario[]): Promise<void> {
        for (const h of horarios) {
            await this.addHorario(h);
        }
    }
}

export default new SQLiteHorario();