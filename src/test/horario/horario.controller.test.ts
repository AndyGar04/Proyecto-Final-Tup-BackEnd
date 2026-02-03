import { describe, it, expect, vi, beforeEach } from 'vitest';
import HorarioController from '../../controllers/horario.controller';
import horarioService from '../../services/horario.service';
import turnoService from '../../services/turno.service';
import { Horario } from '../../models/horario';
import { Turno } from '../../models/turno';

// Mock de los servicios
vi.mock('../../services/horario.service', () => ({
    default: {
        getHorarios: vi.fn(),
        addHorario: vi.fn(),
        deleteHorario: vi.fn(),
        editHorario: vi.fn(),
        size: vi.fn(),
    }
}));

vi.mock('../../services/turno.service', () => ({
    default: {
        getTurno: vi.fn(),
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
const mockTurno = new Turno("1", "Test Turno", 5000);

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
    status: vi.fn(function(this: any) { return this; }),
    json: vi.fn(function(this: any) { return this; }),
} as any;

describe('HorarioController', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest.params = {};
        mockRequest.body = {};
        
        // Setup default mocks
        const mocked = vi.mocked(horarioService);
        const turnoMocked = vi.mocked(turnoService);
        mocked.getHorarios.mockResolvedValue(mockHorarios);
        turnoMocked.getTurno.mockResolvedValue(mockTurno);
    });

    // --- Funcion getHorarios ---
    describe('getHorarios', () => {
        it('Deberia devolver un status 200 y todos los horarios', async () => {
            await HorarioController.getHorarios(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorarios);
        });
    });
    
    // --- Funcion getHorario ---
    describe('getHorario', () => {
        it('Deberia devolver un status 200 y el horario encontrado', async () => {
            mockRequest.params = { id: "1" };
            await HorarioController.getHorario(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorario);
        });

        it('Deberia devolver un status 404 si el horario no es encontrado', async () => {
            mockRequest.params = { id: "99" };
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
            const mocked = vi.mocked(horarioService);
            mocked.addHorario.mockResolvedValueOnce(nuevoHorario);

            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(202);
        });

        it('Deberia devolver un status 402 si faltan parámetros obligatorios (incluido idTurno)', async () => {
            // Arrange
            mockRequest.body = { disponibilidad: true, horario: "11:00", diaHorario: "2025-11-28" }; //Falta idTurno
            
            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
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
                idTurno: "1"
            };
            const horarioEditado = new Horario("1", false, "12:00", new Date("2025-11-27"), "1");
            const mocked = vi.mocked(horarioService);
            mocked.editHorario.mockResolvedValueOnce(horarioEditado);

            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        
        it('Deberia devolver un status 402 si falta el idTurno en la edicion', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = { disponibilidad: true, horario: "12:00", diaHorario: "2025-11-27" }; 
            
            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
        });
    });

    // --- Funcion size ---
    describe('size', () => {
        it('Deberia devolver un status 200 y el tamaño del servicio', async () => {
            const mocked = vi.mocked(horarioService);
            mocked.size.mockResolvedValueOnce(1);
            await HorarioController.size(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ size: 1 });
        });
    });
});
