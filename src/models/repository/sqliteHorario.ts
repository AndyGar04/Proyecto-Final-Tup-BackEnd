import { Horario } from "../horario";
import { HorarioCrud } from "../interface/horarioCrud";
import { openDb } from "../../database/database";
import e from "express";

export class SQLiteHorario implements HorarioCrud {
    
    async getHorarios(): Promise<Array<Horario>> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM horarios');
        
        return rows.map((r: { 
            id: { toString: () => string; }; 
            disponibilidad: any; 
            horario: string; 
            diaHorario: string | number | Date; 
            id_turno: any;
        }) => new Horario(
            r.id.toString(), 
            Boolean(r.disponibilidad), 
            r.horario, 
            new Date(r.diaHorario),
            r.id_turno?.toString() || "" // Pasamos el id del turno al constructor
        ));
    }

    async addHorario(horario: Horario): Promise<Horario> {
        const db = await openDb();
        
        const result = await db.run(
            'INSERT INTO horarios (disponibilidad, horario, diaHorario, id_turno) VALUES (?, ?, ?, ?)',
            [
                horario.getDisponibilidad() ? 1 : 0, 
                horario.getHorario(), 
                horario.getDiaHorario().toISOString(),
                horario.getIdTurno()
            ]
        );
        
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

    async editHorario(id: string, disponibilidad: boolean, horario: string, diaHorario: Date, idTurno: string): Promise<Horario> {
        const db = await openDb();
        
        const fechaParaDB = (diaHorario instanceof Date) ? diaHorario : new Date(diaHorario);

        await db.run(
            'UPDATE horarios SET disponibilidad = ?, horario = ?, diaHorario = ?, id_turno = ? WHERE id = ?',
            [
                disponibilidad ? 1 : 0, 
                horario, 
                fechaParaDB.toISOString(),
                idTurno,
                id
            ]
        );
        return new Horario(id, disponibilidad, horario, fechaParaDB, idTurno);
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