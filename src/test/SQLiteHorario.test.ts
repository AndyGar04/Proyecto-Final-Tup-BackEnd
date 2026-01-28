import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SQLiteHorario } from '../models/repository/sqliteHorario';
import { Horario } from '../models/horario';
import { openDb } from '../database/database';

// Mock del módulo de base de datos
vi.mock('../../database/database', () => ({
    openDb: vi.fn()
}));

describe('SQLiteHorario Service', () => {
    let service: SQLiteHorario;
    
    // Creamos un objeto mock para la base de datos
    const mockDb = {
        all: vi.fn(),
        run: vi.fn(),
        get: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        service = new SQLiteHorario();
        // Forzamos a que openDb devuelva nuestro mockDb
        (openDb as any).mockResolvedValue(mockDb);
    });

    it('Debe obtener todos los horarios y mapearlos a la clase Horario', async () => {
        const mockRows = [
            { id: 1, disponibilidad: 1, horario: "19:00", diaHorario: "2025-05-10T10:00:00Z", turnoId: "T100" }
        ];
        mockDb.all.mockResolvedValue(mockRows);

        const result = await service.getHorarios();

        expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM horarios');
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Horario);
        expect(result[0]?.getHorario()).toBe("19:00");
        expect(result[0]?.getIdTurno()).toBe("T100");
    });

    it('Debe insertar un horario correctamente y asignar el ID generado', async () => {
        const horarioObj = new Horario("", true, "21:00", new Date("2025-06-01"), "T200");
        mockDb.run.mockResolvedValue({ lastID: 50 });

        const result = await service.addHorario(horarioObj);

        expect(mockDb.run).toHaveBeenCalled();
        expect(result.getId()).toBe("50");
    
        expect(mockDb.run.mock.calls[0]?.[1]?.[0]).toBe(1);
    });

    it('Debe editar un horario y retornar la nueva instancia', async () => {
        const nuevaFecha = new Date();
        mockDb.run.mockResolvedValue({ changes: 1 });

        const result = await service.editHorario("50", false, "22:00", nuevaFecha, "T300");

        expect(mockDb.run).toHaveBeenCalled();
        expect(result).toBeInstanceOf(Horario);
        expect(result.getDisponibilidad()).toBe(false);
        expect(result.getIdTurno()).toBe("T300");
    });

    it('Debe lanzar error al eliminar un horario que no existe', async () => {
        mockDb.run.mockResolvedValue({ changes: 0 });

        // En Vitest, para promesas que fallan usamos rejects
        await expect(service.deleteHorario("999")).rejects.toThrow("No existe un Horario con ese id");
    });

    it('Debe retornar el tamaño correcto de la tabla horarios', async () => {
        mockDb.get.mockResolvedValue({ total: 10 });

        const total = await service.size();

        expect(total).toBe(10);
        expect(mockDb.get).toHaveBeenCalledWith('SELECT COUNT(*) as total FROM horarios');
    });
});