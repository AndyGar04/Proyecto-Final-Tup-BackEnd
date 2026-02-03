import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SQLiteHorario } from "../../models/repository/sqliteHorario";
import { Horario } from "../../models/horario";
import { SQLiteTurno } from "../../models/repository/sqliteTurno";
import { openDb } from "../../database/database";

describe("SQLiteHorario", () => {
    let sqliteHorario: SQLiteHorario;
    let sqliteTurno: SQLiteTurno;

    beforeEach(async () => {
        sqliteHorario = new SQLiteHorario();
        sqliteTurno = new SQLiteTurno();
        const db = await openDb();
        
        await db.execute('DELETE FROM horarios');
        await db.execute('DELETE FROM turnos');
        
        await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Test Turno', 5000]
        });
    });

    afterEach(async () => {
        const db = await openDb();
        await db.execute('DELETE FROM horarios');
        await db.execute('DELETE FROM turnos');
    });

    // --- getHorarios ---
    describe("getHorarios", () => {
        it("Debería devolver todos los horarios", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario("", true, "09:00", new Date("2025-11-27"), turnoId);
            await sqliteHorario.addHorario(horario);
            
            const result = await sqliteHorario.getHorarios();

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Horario);
            expect(result[0]?.getHorario()).toBe("09:00");
        });
    });

    // --- addHorario ---
    describe("addHorario", () => {
        it("Debería insertar un horario y devolverlo con id", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario(
                "",
                true,
                "10:00",
                new Date("2025-11-28"),
                turnoId
            );

            const result = await sqliteHorario.addHorario(horario);

            expect(result.getId()).toBeDefined();
            expect(result.getHorario()).toBe("10:00");
        });
    });

    // --- deleteHorario ---
    describe("deleteHorario", () => {
        it("Debería borrar un horario existente", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario("", true, "11:00", new Date(), turnoId);
            const added = await sqliteHorario.addHorario(horario);
            const horarioId = added.getId();

            await sqliteHorario.deleteHorario(horarioId);

            const result = await sqliteHorario.getHorarios();
            expect(result).toHaveLength(0);
        });

        it("Debería lanzar error si no existe el horario", async () => {
            await expect(sqliteHorario.deleteHorario("99999"))
                .rejects
                .toThrow("No existe un Horario con ese id");
        });
    });

    // --- editHorario ---
    describe("editHorario", () => {
        it("Debería editar un horario y devolverlo actualizado", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horario = new Horario("", true, "10:00", new Date("2025-11-27"), turnoId);
            const added = await sqliteHorario.addHorario(horario);
            const horarioId = added.getId();

            const result = await sqliteHorario.editHorario(
                horarioId,
                false,
                "12:00",
                new Date("2025-11-27"),
                turnoId
            );

            expect(result.getHorario()).toBe("12:00");
            expect(result.getDisponibilidad()).toBe(false);
        });
    });

    // --- size ---
    describe("size", () => {
        it("Debería devolver la cantidad de horarios", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            for (let i = 0; i < 3; i++) {
                const horario = new Horario("", true, "10:00", new Date(), turnoId);
                await sqliteHorario.addHorario(horario);
            }

            const result = await sqliteHorario.size();

            expect(result).toBe(3);
        });
    });

    // --- addHorarios ---
    describe("addHorarios", () => {
        it("Debería insertar múltiples horarios", async () => {
            const allTurnos = await sqliteTurno.getTurnos();
            const turnoId = allTurnos[0]?.getId() || "";
            
            const horarios = [
                new Horario("", true, "08:00", new Date(), turnoId),
                new Horario("", false, "09:00", new Date(), turnoId),
            ];

            await sqliteHorario.addHorarios(horarios);

            const result = await sqliteHorario.getHorarios();
            expect(result).toHaveLength(2);
        });
    });
});
