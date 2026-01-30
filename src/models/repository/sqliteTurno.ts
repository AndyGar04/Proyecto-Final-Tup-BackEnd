import { Turno } from "../turno";
import { Horario } from "../horario";
import { TurnoCrud } from "../interface/turnoCrud";
import { openDb } from "../../database/database";

export class SQLiteTurno implements TurnoCrud {
    
    async getTurnos(): Promise<Array<Turno>> {
        const db = await openDb();
        const result = await db.execute('SELECT * FROM turnos');
        const turnos: Turno[] = [];

        for (const row of result.rows) {
            const turno = new Turno((row.id as number).toString(), row.descripcionTurno as string, row.costo as number);
            
            const horariosResult = await db.execute(
                'SELECT * FROM horarios WHERE turnoId = ?',
                [row.id ?? ""]
            );
            const horarios = horariosResult.rows.map((h: any) => new Horario(h.id.toString(), Boolean(h.disponibilidad), h.horario, new Date(h.diaHorario), h.turnoId?.toString() || ""));
            turno.setHorarios(horarios); 
            turnos.push(turno);
        }
        return turnos;
    }

    async addTurno(turno: Turno): Promise<Turno> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: [turno.getDescripcionTurno(), turno.getCosto()]
        });
        turno.setId(result.lastInsertRowid?.toString() || "");
        return turno;
    }

    async addHorarioATurno(idTurno: string, nuevoHorario: Horario): Promise<Turno> {
        const db = await openDb();
        await db.execute({
            sql: 'INSERT INTO horarios (disponibilidad, horario, diaHorario, turnoId) VALUES (?, ?, ?, ?)',
            args: [nuevoHorario.getDisponibilidad() ? 1 : 0, nuevoHorario.getHorario(), nuevoHorario.getDiaHorario().toISOString(), idTurno]
        });
        return this.getTurno(idTurno);
    }

    async getTurno(id: string): Promise<Turno> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT * FROM turnos WHERE id = ?',
            args: [id]
        });
        
        if (result.rows.length === 0) throw new Error("No existe dicho id");
        const row = result.rows[0];
        if (!row) {
            throw new Error("No existe dicho id");
        }

        const turno = new Turno((row.id as number).toString(), row.descripcionTurno as string, row.costo as number);
        const horariosResult = await db.execute({
            sql: 'SELECT * FROM horarios WHERE turnoId = ?',
            args: [id]
        });
        const horarios = horariosResult.rows.map((h: any) => new Horario(h.id.toString(), Boolean(h.disponibilidad), h.horario, new Date(h.diaHorario), h.turnoId?.toString() || id));
        
        turno.setHorarios(horarios);
        return turno;
    }

    async deleteTurno(id: string): Promise<void> {
        const db = await openDb();
        await db.execute({
            sql: 'DELETE FROM turnos WHERE id = ?',
            args: [id]
        });
    }

    async editTurno(id: string, descripcionTurno: string, costo: number): Promise<Turno> {
        const db = await openDb();
        await db.execute({
            sql: 'UPDATE turnos SET descripcionTurno = ?, costo = ? WHERE id = ?',
            args: [descripcionTurno, costo, id]
        });
        return this.getTurno(id);
    }

    async deleteHorarioATurno(turnoId: string, horarioId: string): Promise<Turno> {
        const db = await openDb();
        await db.execute({
            sql: 'DELETE FROM horarios WHERE id = ? AND turnoId = ?',
            args: [horarioId, turnoId]
        });
        return this.getTurno(turnoId);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.execute('SELECT COUNT(*) as total FROM turnos');
        return Number(result.rows[0]?.total || 0);
    }
}

export default new SQLiteTurno();