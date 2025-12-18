import { Turno } from "../turno";
import { Horario } from "../horario";
import { TurnoCrud } from "../interface/turnoCrud";
import { openDb } from "../../database/database";

export class SQLiteTurno implements TurnoCrud {
    
    async getTurnos(): Promise<Array<Turno>> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM turnos');
        const turnos: Turno[] = [];

        for (const row of rows) {
            const turno = new Turno(row.id.toString(), row.descripcionTurno, row.costo);
            
            const horariosRow = await db.all('SELECT * FROM horarios WHERE turnoId = ?', [row.id]);
            const horarios = horariosRow.map(h => new Horario(h.id.toString(), Boolean(h.disponibilidad), h.horario, new Date(h.diaHorario)));
            turno.setHorarios(horarios); 
            turnos.push(turno);
        }
        return turnos;
    }

    async addTurno(turno: Turno): Promise<Turno> {
        const db = await openDb();
        const result = await db.run(
            'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            [turno.getDescripcionTurno(), turno.getCosto()]
        );
        turno.setId(result.lastID?.toString() || "");
        return turno;
    }

    async addHorarioATurno(idTurno: string, nuevoHorario: Horario): Promise<Turno> {
        const db = await openDb();
        await db.run(
            'INSERT INTO horarios (disponibilidad, horario, diaHorario, turnoId) VALUES (?, ?, ?, ?)',
            [nuevoHorario.getDisponibilidad() ? 1 : 0, nuevoHorario.getHorario(), nuevoHorario.getDiaHorario().toISOString(), idTurno]
        );
        return this.getTurno(idTurno);
    }

    async getTurno(id: string): Promise<Turno> {
        const db = await openDb();
        const row = await db.get('SELECT * FROM turnos WHERE id = ?', [id]);
        if (!row) throw new Error("No existe dicho id");

        const turno = new Turno(row.id.toString(), row.descripcionTurno, row.costo);
        const horariosRow = await db.all('SELECT * FROM horarios WHERE turnoId = ?', [id]);
        const horarios = horariosRow.map(h => new Horario(h.id.toString(), Boolean(h.disponibilidad), h.horario, new Date(h.diaHorario)));
        
        turno.setHorarios(horarios);
        return turno;
    }

    async deleteTurno(id: string): Promise<void> {
        const db = await openDb();
        await db.run('DELETE FROM turnos WHERE id = ?', [id]);
    }

    async editTurno(id: string, descripcionTurno: string, costo: number): Promise<Turno> {
        const db = await openDb();
        await db.run(
            'UPDATE turnos SET descripcionTurno = ?, costo = ? WHERE id = ?',
            [descripcionTurno, costo, id]
        );
        return this.getTurno(id);
    }

    async deleteHorarioATurno(turnoId: string, horarioId: string): Promise<Turno> {
        const db = await openDb();
        await db.run('DELETE FROM horarios WHERE id = ? AND turnoId = ?', [horarioId, turnoId]);
        return this.getTurno(turnoId);
    }

    async size(): Promise<number> {
        const db = await openDb();
        const result = await db.get('SELECT COUNT(*) as total FROM turnos');
        return result.total;
    }
}

export default new SQLiteTurno();