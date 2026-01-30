import { Horario } from "../horario";
import { HorarioCrud } from "../interface/horarioCrud";
import { openDb } from "../../database/database";

export class SQLiteHorario implements HorarioCrud {
    
    async getHorarios(): Promise<Array<Horario>> {
        const db = await openDb();
        const result = await db.execute('SELECT * FROM horarios');
        
        return result.rows.map((r: any) => new Horario(
            r.id.toString(), 
            Boolean(r.disponibilidad), 
            r.horario, 
            new Date(r.diaHorario),
            r.turnoId?.toString() || ""
        ));
    }

    async addHorario(horario: Horario): Promise<Horario> {
        const db = await openDb();
        
        const result = await db.execute({
            sql: 'INSERT INTO horarios (disponibilidad, horario, diaHorario, turnoId) VALUES (?, ?, ?, ?)',
            args: [
                horario.getDisponibilidad() ? 1 : 0, 
                horario.getHorario(), 
                horario.getDiaHorario().toISOString(),
                horario.getIdTurno()
            ]
        });
        
        horario.setId(result.lastInsertRowid?.toString() || ""); 
        return horario;
    }

    async deleteHorario(id: string): Promise<void> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'DELETE FROM horarios WHERE id = ?',
            args: [id]
        });
        
        if (result.rowsAffected === 0) {
            throw new Error("No existe un Horario con ese id");
        }
    }

    async editHorario(id: string, disponibilidad: boolean, horario: string, diaHorario: Date, idTurno: string): Promise<Horario> {
        const db = await openDb();
        
        const fechaParaDB = (diaHorario instanceof Date) ? diaHorario : new Date(diaHorario);

        await db.execute({
            sql: 'UPDATE horarios SET disponibilidad = ?, horario = ?, diaHorario = ?, turnoId = ? WHERE id = ?',
            args: [
                disponibilidad ? 1 : 0, 
                horario, 
                fechaParaDB.toISOString(),
                idTurno,
                id
            ]
        });
        
        return new Horario(id, disponibilidad, horario, fechaParaDB, idTurno);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.execute('SELECT COUNT(*) as total FROM horarios');
        return Number(result.rows[0].total);
    }

    async addHorarios(horarios: Horario[]): Promise<void> {
        for (const h of horarios) {
            await this.addHorario(h);
        }
    }
}

export default new SQLiteHorario();