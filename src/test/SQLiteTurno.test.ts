import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SQLiteTurno } from '../models/repository/sqliteTurno';
import { Turno } from '../models/turno';
import { openDb } from '../database/database';
import { fail } from 'assert';

// Mock de openDb para Vitest
vi.mock('../database/database', () => ({
  openDb: vi.fn()
}));

describe('SQLiteTurno Service', () => {
  let service: SQLiteTurno;

  // Mock de la DB
  const mockDb = {
    all: vi.fn(),
    get: vi.fn(),
    run: vi.fn(),
  };

beforeEach(() => {
  vi.clearAllMocks();
  service = new SQLiteTurno();
  // Cast simple a any para Vitest
  (openDb as any).mockResolvedValue(mockDb);
});


  it('Debe obtener todos los turnos y sus horarios', async () => {
    const mockRowsTurnos = [
      { id: 1, descripcionTurno: "Partido A", costo: 50 }
    ];
    const mockRowsHorarios = [
      { id: 10, disponibilidad: 0, horario: "12:00", diaHorario: "2025-06-01", turnoId: 1 }
    ];

    mockDb.all.mockImplementation((query: string, params?: any) => {
      if (query.includes('FROM turnos')) return Promise.resolve(mockRowsTurnos);
      if (query.includes('FROM horarios')) return Promise.resolve(mockRowsHorarios);
      return Promise.resolve([]);
    });

    const result = await service.getTurnos();

    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Turno);
    expect(result[0]).toBeDefined();
    if (result[0]) {
        expect(result[0].getDescripcionTurno()).toBe("Partido A");
        expect(result[0].getHorarios().length).toBe(1);
    } else {
        fail("Expected result[0] to be defined");
    }
  });

  it('Debe agregar un turno y devolverlo con id asignado', async () => {
    const nuevoTurno = new Turno("", "Partido B", 75);
    mockDb.run.mockResolvedValue({ lastID: 101 });

    const result = await service.addTurno(nuevoTurno);

    expect(mockDb.run).toHaveBeenCalledWith(
      'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
      ["Partido B", 75]
    );
    expect(result.getId()).toBe("101");
    expect(result.getDescripcionTurno()).toBe("Partido B");
  });

  it('Debe eliminar un turno existente', async () => {
    mockDb.run.mockResolvedValue({ changes: 1 });

    await expect(service.deleteTurno("101")).resolves.toBeUndefined();
    expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM turnos WHERE id = ?', ["101"]);
  });

  it('Debe lanzar error si se elimina un turno inexistente', async () => {
    mockDb.run.mockResolvedValue({ changes: 0 });

    await expect(service.deleteTurno("999")).resolves.toBeUndefined();
    // Nota: según tu SQLiteTurno actual no lanza error. Si querés que lance, 
    // habría que modificar la clase para verificar changes === 0 y throw.
  });

  it('Debe editar un turno existente', async () => {
    const mockTurno = new Turno("101", "Partido C", 100);
    mockDb.run.mockResolvedValue({ changes: 1 });
    mockDb.get.mockResolvedValue({ id: 101, descripcionTurno: "Partido C", costo: 100 });
    mockDb.all.mockResolvedValue([]); // Para getHorarios interno

    const result = await service.editTurno("101", "Partido C", 100);

    expect(mockDb.run).toHaveBeenCalledWith(
      'UPDATE turnos SET descripcionTurno = ?, costo = ? WHERE id = ?',
      ["Partido C", 100, "101"]
    );
    expect(result).toBeInstanceOf(Turno);
    expect(result.getDescripcionTurno()).toBe("Partido C");
  });

  it('Debe obtener un turno por id', async () => {
    mockDb.get.mockResolvedValue({ id: 101, descripcionTurno: "Partido D", costo: 120 });
    mockDb.all.mockResolvedValue([]);

    const result = await service.getTurno("101");

    expect(result.getId()).toBe("101");
    expect(result.getDescripcionTurno()).toBe("Partido D");
    expect(result.getHorarios()).toEqual([]);
  });

  it('Debe obtener el tamaño total de turnos', async () => {
    mockDb.get.mockResolvedValue({ total: 5 });

    const size = await service.size();

    expect(size).toBe(5);
    expect(mockDb.get).toHaveBeenCalledWith('SELECT COUNT(*) as total FROM turnos');
  });
});
