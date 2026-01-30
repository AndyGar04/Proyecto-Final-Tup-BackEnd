import { describe, it, expect, vi, beforeEach } from "vitest";
import SQLiteHorario from "../models/repository/sqliteHorario";
import { Horario } from "../models/horario";
import { openDb } from "../database/database";

// Mock de openDb
vi.mock("../../database/database", () => ({
    openDb: vi.fn(),
}));

const mockExecute = vi.fn();

const mockDb = {
    execute: mockExecute,
};

describe("SQLiteHorario", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (openDb as any).mockResolvedValue(mockDb);
    });

    // --- getHorarios ---
    describe("getHorarios", () => {
        it("Debería devolver todos los horarios", async () => {
            mockExecute.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        disponibilidad: 1,
                        horario: "09:00",
                        diaHorario: "2025-11-27T00:00:00.000Z",
                        turnoId: 1,
                    },
                ],
            });

            const result = await SQLiteHorario.getHorarios();

            expect(openDb).toHaveBeenCalled();
            expect(mockExecute).toHaveBeenCalledWith("SELECT * FROM horarios");
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Horario);
            expect(result[0].getHorario()).toBe("09:00");
        });
    });

    // --- addHorario ---
    describe("addHorario", () => {
        it("Debería insertar un horario y devolverlo con id", async () => {
            mockExecute.mockResolvedValue({
                lastInsertRowid: 5,
            });

            const horario = new Horario(
                "",
                true,
                "10:00",
                new Date("2025-11-28"),
                "1"
            );

            const result = await SQLiteHorario.addHorario(horario);

            expect(mockExecute).toHaveBeenCalled();
            expect(result.getId()).toBe("5");
        });
    });

    // --- deleteHorario ---
    describe("deleteHorario", () => {
        it("Debería borrar un horario existente", async () => {
            mockExecute.mockResolvedValue({ rowsAffected: 1 });

            await SQLiteHorario.deleteHorario("1");

            expect(mockExecute).toHaveBeenCalled();
        });

        it("Debería lanzar error si no existe el horario", async () => {
            mockExecute.mockResolvedValue({ rowsAffected: 0 });

            await expect(SQLiteHorario.deleteHorario("99"))
                .rejects
                .toThrow("No existe un Horario con ese id");
        });
    });

    // --- editHorario ---
    describe("editHorario", () => {
        it("Debería editar un horario y devolverlo actualizado", async () => {
            mockExecute.mockResolvedValue({});

            const result = await SQLiteHorario.editHorario(
                "1",
                false,
                "12:00",
                new Date("2025-11-27"),
                "1"
            );

            expect(mockExecute).toHaveBeenCalled();
            expect(result.getHorario()).toBe("12:00");
            expect(result.getDisponibilidad()).toBe(false);
        });
    });

    // --- size ---
    describe("size", () => {
        it("Debería devolver la cantidad de horarios", async () => {
            mockExecute.mockResolvedValue({
                rows: [{ total: 3 }],
            });

            const result = await SQLiteHorario.size();

            expect(result).toBe(3);
        });
    });

    // --- addHorarios ---
    describe("addHorarios", () => {
        it("Debería insertar múltiples horarios", async () => {
            mockExecute.mockResolvedValue({ lastInsertRowid: 1 });

            const horarios = [
                new Horario("", true, "08:00", new Date(), "1"),
                new Horario("", false, "09:00", new Date(), "1"),
            ];

            await SQLiteHorario.addHorarios(horarios);

            expect(mockExecute).toHaveBeenCalledTimes(2);
        });
    });
});
