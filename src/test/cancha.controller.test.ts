import { describe, it, expect, vi, beforeEach } from 'vitest';
import CanchaController from '../controllers/cancha.controller';
import canchaService from '../services/cancha.service';
import turnoService from '../services/turno.service';
import { Cancha } from '../models/cancha';

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
const mockCancha = {
    getId: () => "1",
    nombreCancha: "Central",
    deporte: "Fútbol",
    tamanio: 5,
    turno: "100" // ID de Turno existente
} as unknown as Cancha;


describe('CanchaController', () => {
    
    // Limpiar mocks antes de cada test
    beforeEach(() => {
        vi.clearAllMocks();
        // Resetear mockRequest
        mockRequest.params = {};
        mockRequest.body = {};
        
        // Configurar por defecto que el Turno "100" existe para los tests de exito
        (turnoService.getTurno as any).mockResolvedValue({ id: "100" });
        
        // Configurar por defecto que getCancha falle con 404 (para simular nuevo ID en add)
        (canchaService.getCancha as any).mockRejectedValue(new Error("Not Found"));
    });

    // --- addCancha ---
    describe('addCancha', () => {
        const canchaData = { 
            id: "2", 
            nombreCancha: "Auxiliar", 
            deporte: "Tenis", 
            tamanio: 2, 
            turno: "101" 
        };

        it('Deberia devolver 202 y la nueva cancha al crearlo correctamente', async () => {
            // Arrange
            mockRequest.body = canchaData;
            (turnoService.getTurno as any).mockResolvedValue({ id: "101" }); // Asegurar que el turno existe
            (canchaService.addCancha as any).mockResolvedValue(canchaData);

            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("101");
            expect(canchaService.addCancha).toHaveBeenCalledWith(expect.any(Cancha));
            expect(mockResponse.status).toHaveBeenCalledWith(202);
            expect(mockResponse.json).toHaveBeenCalledWith(canchaData);
        });

        it('Deberia devolver 409 si el ID de la cancha ya existe (validacion en caso de duplicado)', async () => {
            // Arrange
            mockRequest.body = { ...canchaData, id: "1" };
            
            // Mockeamos que getCancha SÍ encuentre la cancha (es decir, NO lanza excepción)
            (canchaService.getCancha as any).mockResolvedValue(mockCancha);

            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.getCancha).toHaveBeenCalledWith("1");
            expect(canchaService.addCancha).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Ya existe una cancha con el ID 1." });
        });

        it('Deberia devolver 404 si el Turno asociado no existe', async () => {
            // Arrange
            mockRequest.body = { ...canchaData, turno: "999" };
            
            // Mockeamos que getTurno falle (404)
            const error = new Error("Turno con ID 999 no encontrado");
            (turnoService.getTurno as any).mockRejectedValue(error);

            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(turnoService.getTurno).toHaveBeenCalledWith("999");
            expect(canchaService.addCancha).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Turno con ID 999 no encontrado. No se puede crear la cancha." });
        });
        
        it('Deberia devolver 402 si falta el nombreCancha', async () => {
            // Arrange
            mockRequest.body = { id: "3", deporte: "Tenis", tamanio: 2, turno: "100" };
            
            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: " Nombre de la cancha, Deporte, Tamanio o Turno no parametrizado " });
            expect(canchaService.addCancha).not.toHaveBeenCalled();
        });
    });
    
    // --- editCancha ---
    describe('editCancha', () => {
        const updatedData = { 
            nombreCancha: "Principal Editada", 
            deporte: "Vóley", 
            tamanio: 6, 
            turno: "102" 
        };
        const idToEdit = "1";

        it('Deberia devolver 200 y la cancha modificada', async () => {
            // Arrange
            mockRequest.params = { id: idToEdit };
            mockRequest.body = updatedData;
            
            // Mockeamos que la cancha y el nuevo turno existan
            (canchaService.getCancha as any).mockResolvedValue(mockCancha); 
            (turnoService.getTurno as any).mockResolvedValue({ id: "102" });
            (canchaService.editCancha as any).mockResolvedValue({ id: idToEdit, ...updatedData });

            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.getCancha).toHaveBeenCalledWith(idToEdit);
            expect(turnoService.getTurno).toHaveBeenCalledWith("102");
            expect(canchaService.editCancha).toHaveBeenCalledWith(idToEdit, updatedData.nombreCancha, updatedData.deporte, updatedData.tamanio, updatedData.turno);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        
        it('Deberia devolver 404 si la Cancha a editar no existe', async () => {
            // Arrange
            mockRequest.params = { id: "99" };
            mockRequest.body = updatedData;
            
            // Mockeamos que getCancha falle (404)
            const error = new Error("Cancha con ID 99 no encontrada");
            (canchaService.getCancha as any).mockRejectedValue(error);

            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.getCancha).toHaveBeenCalledWith("99");
            expect(turnoService.getTurno).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });

        it('Deberia devolver 404 si el nuevo Turno asociado no existe', async () => {
            // Arrange
            mockRequest.params = { id: idToEdit };
            mockRequest.body = { ...updatedData, turno: "999" };
            
            // Mockeamos que la cancha exista, pero el turno falle
            (canchaService.getCancha as any).mockResolvedValue(mockCancha);
            const error = new Error("Turno con ID 999 no encontrado");
            (turnoService.getTurno as any).mockRejectedValue(error);

            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.getCancha).toHaveBeenCalledWith(idToEdit);
            expect(turnoService.getTurno).toHaveBeenCalledWith("999");
            expect(canchaService.editCancha).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
        
        it('Deberia devolver 402 si falta el parámetro "tamanio" en el body', async () => {
            // Arrange
            mockRequest.params = { id: idToEdit };
            mockRequest.body = { nombreCancha: "Test", deporte: "Vóley", turno: "100" }; // Falta 'tamanio'
            
            // Act
            await CanchaController.editCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Parametros de cancha incompletos" });
            expect(canchaService.getCancha).not.toHaveBeenCalled();
        });
    });
    
    // --- getCanchas (Test de flujo básico) ---
    describe('getCanchas', () => {
        it('Deberia devolver un status 200 y todas las canchas', async () => {
            // Arrange
            const mockCanchas = [mockCancha];
            (canchaService.getCanchas as any).mockResolvedValue(mockCanchas);
            
            // Act
            await CanchaController.getCanchas(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCanchas);
        });
    });

    // --- deleteCancha (Test de flujo básico) ---
    describe('deleteCancha', () => {
        it('Deberia devolver un status 200 y mensaje de exito', () => {
            // Arrange
            mockRequest.params = { id: "1" };
            (canchaService.deleteCancha as any).mockImplementation(() => {});

            // Act
            CanchaController.deleteCancha(mockRequest, mockResponse);

            // Assert
            expect(canchaService.deleteCancha).toHaveBeenCalledWith("1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Cancha eliminada" });
        });
    });
});