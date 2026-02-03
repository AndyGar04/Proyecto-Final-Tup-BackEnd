import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SQLiteTurno } from "../../models/repository/sqliteTurno";
import { Turno } from "../../models/turno";
import { Horario } from "../../models/horario";
import { openDb } from "../../database/database";

describe("SQLiteTurno", () => {
    let sqliteTurno: SQLiteTurno;

    beforeEach(async () => {
        sqliteTurno = new SQLiteTurno();
        const db = await openDb();
        
        // Limpiar tablas
        await db.execute('DELETE FROM horarios');
        await db.execute('DELETE FROM turnos');
        
        // Insertar datos de prueba
        await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Cancha Futbol', 5000]
        });
        await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Tenis', 4000]
        });
        await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Voley', 3000]
        });
    });

    afterEach(async () => {
        const db = await openDb();
        await db.execute('DELETE FROM horarios');
        await db.execute('DELETE FROM turnos');
    });

    // --- getTurnos ---
    describe("getTurnos", () => {
        it("Debería devolver los turnos con sus horarios", async () => {
            const result = await sqliteTurno.getTurnos();

            expect(result).toHaveLength(3);
            expect(result[0]).toBeInstanceOf(Turno);
            expect(result[0]!.getDescripcionTurno()).toBe("Cancha Futbol");
        });
    });

    // --- addTurno ---
    describe("addTurno", () => {
        it("Debería insertar un turno y devolverlo con id", async () => {
            const turno = new Turno("", "Cancha Paddle", 7000);
            const result = await sqliteTurno.addTurno(turno);

            expect(result.getId()).toBeDefined();
            expect(result.getDescripcionTurno()).toBe("Cancha Paddle");
            expect(result.getCosto()).toBe(7000);
        });
    });

    // --- getTurno ---
    describe("getTurno", () => {
        it("Debería devolver un turno con horarios", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const turno = await sqliteTurno.getTurno(turnoId);

            expect(turno).toBeInstanceOf(Turno);
            expect(turno.getId()).toBe(turnoId);
            expect(turno.getDescripcionTurno()).toBe("Cancha Futbol");
        });

        it("Debería lanzar error si el turno no existe", async () => {
            await expect(sqliteTurno.getTurno("99999"))
                .rejects
                .toThrow("No existe dicho id");
        });
    });

    // --- addHorarioATurno ---
    describe("addHorarioATurno", () => {
        it("Debería agregar un horario a un turno y devolver el turno", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario("", true, "11:00", new Date(), turnoId);

            const turno = await sqliteTurno.addHorarioATurno(turnoId, horario);

            expect(turno).toBeInstanceOf(Turno);
            expect(turno.getId()).toBe(turnoId);
        });
    });

    // --- editTurno ---
    describe("editTurno", () => {
        it("Debería editar un turno y devolverlo actualizado", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const turno = await sqliteTurno.editTurno(turnoId, "Basquet", 8000);

            expect(turno.getDescripcionTurno()).toBe("Basquet");
            expect(turno.getCosto()).toBe(8000);
        });
    });

    // --- deleteTurno ---
    describe("deleteTurno", () => {
        it("Debería eliminar un turno", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            await sqliteTurno.deleteTurno(turnoId);

            const result = await sqliteTurno.getTurnos();
            expect(result).toHaveLength(2);
        });
    });

    // --- deleteHorarioATurno ---
    describe("deleteHorarioATurno", () => {
        it("Debería eliminar un horario de un turno y devolver el turno", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario("", true, "11:00", new Date(), turnoId);
            const turnoConHorario = await sqliteTurno.addHorarioATurno(turnoId, horario);
            
            const horarioId = turnoConHorario.getHorarios()[0]?.getId() || "";
            const result = await sqliteTurno.deleteHorarioATurno(turnoId, horarioId);

            expect(result).toBeInstanceOf(Turno);
        });
    });

    // --- size ---
    describe("size", () => {
        it("Debería devolver la cantidad de turnos", async () => {
            const size = await sqliteTurno.size();

            expect(size).toBe(3);
        });
    });
});
