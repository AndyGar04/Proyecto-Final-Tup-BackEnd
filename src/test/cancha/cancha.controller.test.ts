import { describe, it, expect, vi, beforeEach } from 'vitest';
import CanchaController from '../../controllers/cancha.controller';
import canchaService from '../../services/cancha.service';
import turnoService from '../../services/turno.service';
import { Cancha } from '../../models/cancha';

// Mock de los servicios
vi.mock('../services/cancha.service', () => ({
    default: {
        getCanchas: vi.fn(),
        getCancha: vi.fn(),
        addCancha: vi.fn(),
        deleteCancha: vi.fn(),
        editCancha: vi.fn(),
        size: vi.fn(),
    }
}));

vi.mock('../services/turno.service', () => ({
    default: {
        getTurno: vi.fn(),
    }
}));

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
    status: vi.fn(() => mockResponse),
    json: vi.fn(() => mockResponse),
} as any;

// Datos de prueba
const mockTurno = { id: "100", descripcionTurno: "Futbol 5", costo: 5000 };
const mockCancha = new Cancha("1", "Central", "Futbol", "5", mockTurno as any);

describe('CanchaController', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest.params = {};
        mockRequest.body = {};
    });

    // --- Funcion addCancha ---
    describe('addCancha', () => {
        const canchaDataBody = { 
            nombreCancha: "Auxiliar", 
            deporte: "Tenis", 
            tamanio: 2, 
            idTurno: "100",
            clubId: "1" 
        };

        it('Deberia devolver 400 si el Turno asociado no existe', async () => {
            // Arrange
            mockRequest.body = canchaDataBody;
            (turnoService.getTurno as any).mockRejectedValue(new Error("Turno no encontrado"));

            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400); //
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                message: "Nombre de la cancha, Deporte, Tamanio, idTurno o idClub no parametrizado"
            });
        });
        
        it('Deberia devolver 400 si faltan parámetros (clubId, idTurno, etc.)', async () => {
            // Arrange
            mockRequest.body = { nombreCancha: "Test", deporte: "Tenis", tamanio: 2, idTurno: "100" }; // Falta idClub
            
            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400); //
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                message: "Nombre de la cancha, Deporte, Tamanio, idTurno o idClub no parametrizado" 
            });
        });
    });
    
    // --- editCancha ---
    describe('editCancha', () => {
        const editBody = { 
            nombreCancha: "Principal Editada", 
            deporte: "Voley", 
            tamanio: 6, 
            idTurno: "102" 
        };

        it('Deberia devolver 200 y la cancha modificada', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = editBody;
            
            (canchaService.getCancha as any).mockResolvedValue(mockCancha); 
            (turnoService.getTurno as any).mockResolvedValue({ id: "102" });
            (canchaService.editCancha as any).mockResolvedValue({ id: "1", ...editBody });

            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.getCancha).toHaveBeenCalledWith("1");
            expect(turnoService.getTurno).toHaveBeenCalledWith("102");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 402 si los parámetros del body están incompletos', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = { nombreCancha: "Test" }; // Faltan otros campos obligatorios
            
            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Parametros de cancha incompletos" });
        });
    });

    // --- deleteCancha ---
    describe('deleteCancha', () => {
        it('Deberia devolver 200 al eliminar con éxito', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            (canchaService.deleteCancha as any).mockResolvedValue(undefined);

            // Act
            await CanchaController.deleteCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Cancha eliminada" });
        });

        it('Deberia devolver 402 si no se provee el ID', async () => {
            // Arrange
            mockRequest.params = {};
            
            // Act
            await CanchaController.deleteCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
        });
    });
});