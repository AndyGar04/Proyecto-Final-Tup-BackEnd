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
const mockHorario = new Horario("1", true, "10:00", new Date("2025-11-30"), "1");
const mockTurno = new Turno("1", "Fútbol 5", 5000);

describe('TurnoController', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest.params = {};
        mockRequest.body = {};
    });

    // --- Funcion addTurno ---
    describe('addTurno', () => {
        it('Deberia devolver 201 y el nuevo turno al crearlo correctamente', async () => {
            // Arrange
            mockRequest.body = { descripcionTurno: "Basquet", costo: 4500 };
            const turnoCreado = { ...mockRequest.body, id: "2" };
            
            (turnoService.addTurno as any).mockResolvedValue(turnoCreado);

            // Act
            await TurnoController.addTurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.addTurno).toHaveBeenCalledWith(expect.any(Turno));
            expect(mockResponse.status).toHaveBeenCalledWith(201); // Cambiado a 201
            expect(mockResponse.json).toHaveBeenCalledWith(turnoCreado);
        });

        it('Deberia devolver 400 si faltan datos obligatorios', async () => {
            // Arrange
            mockRequest.body = { costo: 2000 }; // Falta descripcionTurno
            
            // Act
            await TurnoController.addTurno(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400); //
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Faltan datos: descripcionTurno o costo" });
            expect(turnoService.addTurno).not.toHaveBeenCalled();
        });
    });

    // --- Funcion addHorarioATurno ---
    describe('addHorarioATurno', () => {
        const newHorarioBody = { disponibilidad: true, horario: "11:00", diaHorario: "2025-11-30T10:00:00Z" };

        it('Deberia devolver 200 y el turno modificado al agregar un nuevo horario', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1" };
            mockRequest.body = newHorarioBody;
            
            (turnoService.addHorarioATurno as any).mockResolvedValue(mockTurno);

            // Act
            await TurnoController.addHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.addHorarioATurno).toHaveBeenCalledWith("1", expect.any(Horario));
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 400 si faltan parametros para el horario', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1" };
            mockRequest.body = { horario: "11:00" }; // Faltan disponibilidad y diaHorario
            
            // Act
            await TurnoController.addHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Faltan parametros para el horario" });
        });
        
        it('Deberia devolver 500 si ocurre un error en el servicio', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1" };
            mockRequest.body = newHorarioBody;
            (turnoService.addHorarioATurno as any).mockRejectedValue(new Error("DB Error"));

            // Act
            await TurnoController.addHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });
    });

    // --- Funcion deleteHorarioATurno ---
    describe('deleteHorarioATurno', () => {
        it('Deberia devolver 200 al eliminar un horario existente del turno', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: "1" };
            (turnoService.deleteHorarioATurno as any).mockResolvedValue(mockTurno);

            // Act
            await TurnoController.deleteHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(turnoService.deleteHorarioATurno).toHaveBeenCalledWith("1", "1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 404 si el servicio lanza error (Turno/Horario no encontrado)', async () => {
            // Arrange
            mockRequest.params = { idTurno: "1", idHorario: "99" };
            const error = new Error("Horario no encontrado");
            (turnoService.deleteHorarioATurno as any).mockRejectedValue(error);

            // Act
            await TurnoController.deleteHorarioATurno(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});