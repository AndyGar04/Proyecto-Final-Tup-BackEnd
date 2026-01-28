import { describe, it, expect, vi, beforeEach } from 'vitest';
import HorarioController from '../controllers/horario.controller';
import horarioService from '../services/horario.service';
import { Horario } from '../models/horario';

// Mock del servicio
vi.mock('../services/horario.service', () => ({
    default: {
        getHorarios: vi.fn(),
        addHorario: vi.fn(),
        deleteHorario: vi.fn(),
        editHorario: vi.fn(),
        size: vi.fn(),
    }
}));

// Datos de prueba
const mockHorario = new Horario(
    "1", 
    true, 
    "09:00", 
    new Date("2025-11-27"),
    "1" // idTurno
);
const mockHorarios = [mockHorario];

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
    status: vi.fn(() => mockResponse),
    json: vi.fn(() => mockResponse),
} as any;

describe('HorarioController', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest.params = {};
        mockRequest.body = {};
    });

    // --- Funcion getHorarios ---
    describe('getHorarios', () => {
        it('Deberia devolver un status 200 y todos los horarios', async () => {
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios);
            await HorarioController.getHorarios(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorarios);
        });
    });
    
    // --- Funcion getHorario ---
    describe('getHorario', () => {
        it('Deberia devolver un status 200 y el horario encontrado', async () => {
            mockRequest.params = { id: "1" };
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios);
            await HorarioController.getHorario(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorario);
        });

        it('Deberia devolver un status 404 si el horario no es encontrado', async () => {
            mockRequest.params = { id: "99" };
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios);
            await HorarioController.getHorario(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Horario no encontrado" });
        });
    });

    // --- Funcion addHorario ---
    describe('addHorario', () => {
        it('Deberia devolver un status 202 y el nuevo horario creado', async () => {
            // Arrange
            mockRequest.body = {
                disponibilidad: false,
                horario: "10:00",
                diaHorario: "2025-11-28",
                idTurno: "1"
            };
            const nuevoHorario = new Horario("2", false, "10:00", new Date("2025-11-28"), "1");
            (horarioService.addHorario as any).mockResolvedValue(nuevoHorario);

            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.addHorario).toHaveBeenCalledWith(expect.any(Horario));
            expect(mockResponse.status).toHaveBeenCalledWith(202);
            expect(mockResponse.json).toHaveBeenCalledWith(nuevoHorario);
        });

        it('Deberia devolver un status 402 si faltan parámetros obligatorios (incluido idTurno)', async () => {
            // Arrange
            mockRequest.body = { disponibilidad: true, horario: "11:00", diaHorario: "2025-11-28" }; //Falta idTurno
            
            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.addHorario).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Faltan parametros: disponibilidad, diaHorario, horario o idTurno" });
        });
    });

    // --- Funcion editHorario ---
    describe('editHorario', () => {
        it('Deberia devolver un status 200 y el horario modificado', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = {
                disponibilidad: false,
                horario: "12:00",
                diaHorario: "2025-11-27",
                idTurno: "1" // Requerido en la edicion
            };
            const horarioEditado = new Horario("1", false, "12:00", new Date("2025-11-27"), "1");
            (horarioService.editHorario as any).mockResolvedValue(horarioEditado);

            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.editHorario).toHaveBeenCalledWith("1", false, "12:00", expect.any(Date), "1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(horarioEditado);
        });
        
        it('Deberia devolver un status 402 si falta el idTurno en la edicion', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = { disponibilidad: true, horario: "12:00", diaHorario: "2025-11-27" }; 
            
            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Id de horario o idTurno no definido" });
        });
    });

    // --- Funcion size ---
    describe('size', () => {
        it('Deberia devolver un status 200 y el tamaño del servicio', async () => {
            (horarioService.size as any).mockReturnValue(1);
            HorarioController.size(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ size: 1 });
        });
    });
});