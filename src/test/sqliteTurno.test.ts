import { describe, it, expect, vi, beforeEach } from "vitest";
import { SQLiteHorario } from "../models/repository/sqliteTurno";
import { Turno } from "../models/turno";
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

describe("SQLiteTurno", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        (openDb as any).mockResolvedValue(mockDb);
    });

    // --- getTurnos ---
    describe("getTurnos", () => {
        it("Debería devolver los turnos con sus horarios", async () => {
            mockExecute
                .mockResolvedValueOnce({
                    rows: [
                        { id: 1, descripcionTurno: "Cancha Futbol", costo: 5000 },
                    ],
                })
                .mockResolvedValueOnce({
                    rows: [
                        {
                            id: 10,
                            disponibilidad: 1,
                            horario: "09:00",
                            diaHorario: "2025-11-27T00:00:00.000Z",
                            turnoId: 1,
                        },
                    ],
                });

            const result = await SQLiteTurno.getTurnos();

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(Turno);
            expect(result[0].getDescripcionTurno()).toBe("Cancha Futbol");
            expect(result[0].getHorarios()).toHaveLength(1);
        });
    });

    // --- addTurno ---
    describe("addTurno", () => {
        it("Debería insertar un turno y devolverlo con id", async () => {
            mockExecute.mockResolvedValue({
                lastInsertRowid: 3,
            });

            const turno = new Turno("", "Cancha Paddle", 7000);
            const result = await SQLiteTurno.addTurno(turno);

            expect(result.getId()).toBe("3");
            expect(mockExecute).toHaveBeenCalled();
        });
    });

    // --- getTurno ---
    describe("getTurno", () => {
        it("Debería devolver un turno con horarios", async () => {
            mockExecute
                .mockResolvedValueOnce({
                    rows: [{ id: 1, descripcionTurno: "Tenis", costo: 4000 }],
                })
                .mockResolvedValueOnce({
                    rows: [
                        {
                            id: 5,
                            disponibilidad: 1,
                            horario: "10:00",
                            diaHorario: "2025-11-27T00:00:00.000Z",
                            turnoId: 1,
                        },
                    ],
                });

            const turno = await SQLiteTurno.getTurno("1");

            expect(turno).toBeInstanceOf(Turno);
            expect(turno.getHorarios()).toHaveLength(1);
        });

        it("Debería lanzar error si el turno no existe", async () => {
            mockExecute.mockResolvedValue({
                rows: [],
            });

            await expect(SQLiteTurno.getTurno("99"))
                .rejects
                .toThrow("No existe dicho id");
        });
    });

    // --- addHorarioATurno ---
    describe("addHorarioATurno", () => {
        it("Debería agregar un horario a un turno y devolver el turno", async () => {
            mockExecute
                .mockResolvedValueOnce({}) // insert horario
                .mockResolvedValueOnce({
                    rows: [{ id: 1, descripcionTurno: "Futbol", costo: 6000 }],
                })
                .mockResolvedValueOnce({
                    rows: [],
                });

            const horario = new Horario("", true, "11:00", new Date(), "1");

            const turno = await SQLiteTurno.addHorarioATurno("1", horario);

            expect(turno).toBeInstanceOf(Turno);
            expect(mockExecute).toHaveBeenCalled();
        });
    });

    // --- editTurno ---
    describe("editTurno", () => {
        it("Debería editar un turno y devolverlo actualizado", async () => {
            mockExecute
                .mockResolvedValueOnce({}) // update
                .mockResolvedValueOnce({
                    rows: [{ id: 1, descripcionTurno: "Basquet", costo: 8000 }],
                })
                .mockResolvedValueOnce({
                    rows: [],
                });

            const turno = await SQLiteTurno.editTurno("1", "Basquet", 8000);

            expect(turno.getDescripcionTurno()).toBe("Basquet");
            expect(turno.getCosto()).toBe(8000);
        });
    });

    // --- deleteTurno ---
    describe("deleteTurno", () => {
        it("Debería eliminar un turno", async () => {
            mockExecute.mockResolvedValue({});

            await SQLiteTurno.deleteTurno("1");

            expect(mockExecute).toHaveBeenCalled();
        });
    });

    // --- deleteHorarioATurno ---
    describe("deleteHorarioATurno", () => {
        it("Debería eliminar un horario de un turno y devolver el turno", async () => {
            mockExecute
                .mockResolvedValueOnce({}) // delete horario
                .mockResolvedValueOnce({
                    rows: [{ id: 1, descripcionTurno: "Voley", costo: 3000 }],
                })
                .mockResolvedValueOnce({
                    rows: [],
                });

            const turno = await SQLiteTurno.deleteHorarioATurno("1", "10");

            expect(turno).toBeInstanceOf(Turno);
        });
    });

    // --- size ---
    describe("size", () => {
        it("Debería devolver la cantidad de turnos", async () => {
            mockExecute.mockResolvedValue({
                rows: [{ total: 4 }],
            });

            const size = await SQLiteTurno.size();

            expect(size).toBe(4);
        });
    });
});
