import { describe, it, expect, vi, beforeEach } from 'vitest';
import TurnoController from '../controllers/turno.controller';
import turnoService from '../services/turno.service';
import { Turno } from '../models/turno';
import { Horario } from '../models/horario';

// Mock del servicio de Turno
vi.mock('../services/turno.service', () => ({
    default: {
        getTurnos: vi.fn(),
        getTurno: vi.fn(),
        addTurno: vi.fn(),
        deleteTurno: vi.fn(),
        editTurno: vi.fn(),
        addHorarioATurno: vi.fn(),
        deleteHorarioATurno: vi.fn(),
        size: vi.fn(),
    }
}));

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
    status: vi.fn(() => mockResponse),
    json: vi.fn(() => mockResponse),
} as any;

// Datos de prueba
const mockHorario = new Horario("1", true, "10:00", new Date("2025-11-30"));
const mockTurno = {
    getId: () => "1",
    descripcionTurno: "Fútbol 5",
    costo: 5000,
    getHorarios: () => [mockHorario],
    // Simula la estructura básica que podría devolver el servicio
} as unknown as Turno;
const mockTurnos = [mockTurno];


describe('TurnoController', () => {
    
    // Limpiar mocks antes de cada test
    beforeEach(() => {
        vi.clearAllMocks();
        // Resetear mockRequest para que no arrastre parámetros entre tests
        mockRequest.params = {};
        mockRequest.body = {};
    });

    // --- addTurno ---
    describe('addTurno', () => {
        it('Deberia devolver 202 y el nuevo turno al crearlo correctamente', async () => {
            // Arrange
            mockRequest.body = { id: "2", descripcionTurno: "Basquet", costo: 4500 };
            
            // Mockeamos que getTurno falle (404), indicando que es un ID nuevo
            (turnoService.getTurno as any).mockRejectedValue(new Error("Not Found"));
            (turnoService.addTurno as any).mockResolvedValue(mockRequest.body);

            // Act
            await TurnoController.addTurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("2");
            expect(turnoService.addTurno).toHaveBeenCalledWith(expect.any(Turno));
            expect(mockResponse.status).toHaveBeenCalledWith(202);
            expect(mockResponse.json).toHaveBeenCalledWith(mockRequest.body);
        });

        it('Deberia devolver 409 si el ID del turno ya existe (Validación de Duplicado)', async () => {
            // Arrange
            mockRequest.body = { id: "1", descripcionTurno: "Futbol 5", costo: 5000 };
            
            // Mockeamos que getTurno SÍ encuentre el turno (es decir, NO lanza excepción)
            (turnoService.getTurno as any).mockResolvedValue(mockTurno);

            // Act
            await TurnoController.addTurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("1");
            expect(turnoService.addTurno).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Ya existe un turno con el ID 1." });
        });

        it('Deberia devolver 402 si falta la descripcionTurno', async () => {
            // Arrange
            mockRequest.body = { id: "T3", costo: 2000 };
            
            // Act
            await TurnoController.addTurno(mockRequest, mockResponse);

            // Assert
            // El primer chequeo pasa, pero el segundo devuelve 402 y se detiene
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Descripcion turno, costo u horario no parametrizado" });
            expect(turnoService.addTurno).not.toHaveBeenCalled();
        });
    });

    // --- addHorario ---
    describe('addHorario', () => {
        const newHorarioData = { disponibilidad: true, horario: "11:00", diaHorario: "2025-11-30" };
        const newHorarioID = "2";

        it('Deberia devolver 200 y el turno modificado al agregar un nuevo horario', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: newHorarioID };
            mockRequest.body = newHorarioData;
            
            // Mockeamos el Turno (getHorarios no contiene 2)
            (turnoService.getTurno as any).mockResolvedValue(mockTurno);
            (turnoService.addHorarioATurno as any).mockResolvedValue({ ...mockTurno, horarios: [mockHorario, newHorarioData] });

            // Act
            await TurnoController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("1");
            expect(turnoService.addHorarioATurno).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 409 si el horario ya está asociado al turno (Validación de Duplicado)', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: "1" }; // Usando 1 que ya está en mockHorario
            mockRequest.body = newHorarioData;
            
            // Mockeamos el Turno (getHorarios SÍ contiene 1)
            (turnoService.getTurno as any).mockResolvedValue(mockTurno);

            // Act
            await TurnoController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("1");
            expect(turnoService.addHorarioATurno).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "El horario con ID 1 ya está asociado al turno 1." });
        });
        
        it('Deberia devolver 404 si el Turno no existe', async () => {
            // Arrange
            mockRequest.params = { idTurno: "10", idHorario: newHorarioID };
            mockRequest.body = newHorarioData;
            
            // Mockeamos que getTurno lance error (404)
            const error = new Error("Turno con ID T99 no encontrado");
            (turnoService.getTurno as any).mockRejectedValue(error);

            // Act
            await TurnoController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("10");
            expect(turnoService.addHorarioATurno).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    // --- deleteHorarioATurno ---
    describe('deleteHorarioATurno', () => {
        it('Deberia devolver 200 al eliminar un horario existente del turno', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: "1" };
            (turnoService.getTurno as any).mockResolvedValue(mockTurno); // Simula que el turno existe
            (turnoService.deleteHorarioATurno as any).mockResolvedValue(mockTurno);

            // Act
            await TurnoController.deleteHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("1");
            expect(turnoService.deleteHorarioATurno).toHaveBeenCalledWith("1", "1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 404 si el Turno no existe', async () => {
            // Arrange
            mockRequest.params = { idTurno: "10", idHorario: "1" };
            const error = new Error("Turno con ID 10 no encontrado");
            
            // Mockeamos que getTurno lance error (404)
            (turnoService.getTurno as any).mockRejectedValue(error);

            // Act
            await TurnoController.deleteHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("10");
            expect(turnoService.deleteHorarioATurno).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
        
        it('Deberia devolver 404 si el horario no existe en el turno', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: "10" };
            (turnoService.getTurno as any).mockResolvedValue(mockTurno);
            
            // Mockeamos que el servicio de delete lance un error si el horario no está asociado
            const error = new Error("Horario 10 no encontrado en Turno 1");
            (turnoService.deleteHorarioATurno as any).mockRejectedValue(error);

            // Act
            await TurnoController.deleteHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.deleteHorarioATurno).toHaveBeenCalledWith("1", "10");
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
    
});