// horario.controller.test.ts
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
    new Date("2025-11-27")
);
const mockHorarios = [mockHorario];

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
    status: vi.fn(() => mockResponse),
    json: vi.fn(() => mockResponse),
} as any;

describe('HorarioController', () => {
    
    // Limpiar mocks antes de cada test
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // --- getHorarios ---
    describe('getHorarios', () => {
        it('Deberia devolver un status 200 y todos los horarios', async () => {
            // Arrange
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios);
            
            // Act
            await HorarioController.getHorarios(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorarios);
            expect(horarioService.getHorarios).toHaveBeenCalledTimes(1);
        });
    });
    
    // --- getHorario ---
    describe('getHorario', () => {
        it('Deberia devolver un status 200 y el horario encontrado', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios);
            
            // Act
            await HorarioController.getHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockHorario);
        });

        it('Deberia devolver un status 404 si el horario no es encontrado', async () => {
            // Arrange
            mockRequest.params = { id: "99" };
            (horarioService.getHorarios as any).mockResolvedValue(mockHorarios); // Devuelve datos pero el ID no existe
            
            // Act
            await HorarioController.getHorario(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Horario no encontrado" });
        });
    });

    // --- addHorario ---
    describe('addHorario', () => {
        it('Deberia devolver un status 202 y el nuevo horario creado', async () => {
            // Arrange
            mockRequest.body = {
                id: "2",
                disponibilidad: false,
                horario: "10:00",
                diaHorario: "2025-11-28" 
            };
            const nuevoHorario = new Horario("2", false, "10:00", new Date("2025-11-28"));
            (horarioService.addHorario as any).mockResolvedValue(nuevoHorario);

            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.addHorario).toHaveBeenCalledWith(expect.any(Horario));
            expect(mockResponse.status).toHaveBeenCalledWith(202);
            expect(mockResponse.json).toHaveBeenCalledWith(nuevoHorario);
        });

        it('Deberia devolver un status 402 si falta la disponibilidad o el horario o diaHorario', async () => {
            // Arrange
            mockRequest.body = { id: "3", horario: "11:00" }; // Falta disponibilidad y diaHorario
            
            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.addHorario).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(402);
        });
        
        it('Deberia devolver un status 402 si falta el ID', async () => {
            // Arrange
            mockRequest.body = { disponibilidad: true, horario: "11:00", diaHorario: "2025-11-28" }; // Falta ID
            
            // Act
            await HorarioController.addHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.addHorario).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Id no parametrizado" });
        });
    });
    
    // --- deleteHorario ---
    describe('deleteHorario', () => {
        it('Deberia devolver un status 200 y mensaje de exito', () => {
            // Arrange
            mockRequest.params = { id: "1" };
            (horarioService.deleteHorario as any).mockImplementation(() => {});

            // Act
            HorarioController.deleteHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.deleteHorario).toHaveBeenCalledWith("1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Horario eliminada" });
        });

        it('Deberia devolver un status 404 si el servicio lanza un error', () => {
            // Arrange
            mockRequest.params = { id: "99" };
            const error = new Error("Horario no encontrado");
            (horarioService.deleteHorario as any).mockImplementation(() => {
                throw error;
            });

            // Act
            HorarioController.deleteHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.deleteHorario).toHaveBeenCalledWith("99");
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error });
        });
    });

    // --- editHorario ---
    describe('editHorario', () => {
        it('Deberia devolver un status 200 y el horario modificado', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = {
                disponibilidad: false,
                horario: "12:00",
                diaHorario: "2025-11-27"
            };
            const horarioEditado = new Horario("1", false, "12:00", new Date("2025-11-27"));
            (horarioService.editHorario as any).mockResolvedValue(horarioEditado);

            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.editHorario).toHaveBeenCalledWith("1", false, "12:00", "2025-11-27");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(horarioEditado);
        });
        
        it('Deberia devolver un status 404 si el servicio lanza un error', async () => {
            // Arrange
            mockRequest.params = { id: "99" };
            mockRequest.body = {
                disponibilidad: true,
                horario: "12:00",
                diaHorario: "2025-11-27"
            };
            const error = new Error("Horario con id 99 no encontrado");
            (horarioService.editHorario as any).mockRejectedValue(error);

            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.editHorario).toHaveBeenCalledWith("99", true, "12:00", "2025-11-27");
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
        
        it('Deberia devolver un status 402 si falta un parámetro en el body', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = { horario: "12:00" }; // Faltan disponibilidad y diaHorario
            
            // Act
            await HorarioController.editHorario(mockRequest, mockResponse);

            // Assert
            expect(horarioService.editHorario).not.toHaveBeenCalled();
            });
    });

    // --- size ---
    describe('size', () => {
        it('Deberia devolver un status 200 y el tamaño del servicio', () => {
            // Arrange
            (horarioService.size as any).mockReturnValue(1);
            
            // Act
            HorarioController.size(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ size: 1 });
        });
    });
});