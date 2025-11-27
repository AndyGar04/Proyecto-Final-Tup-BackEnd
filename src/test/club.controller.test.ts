import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClubController from '../controllers/club.controller';
import clubService from '../services/club.service';
import { Club } from '../models/club';
import { Cancha } from '../models/cancha';

// Mock de los servicios
vi.mock('../services/club.service', () => ({
    default: {
        getClubs: vi.fn(),
        getClub: vi.fn(),
        addClub: vi.fn(),
        deleteClub: vi.fn(),
        editClub: vi.fn(),
        addCanchaAClub: vi.fn(),
        deleteCanchaAClub: vi.fn(),
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
const mockCancha1 = {
    getId: () => "101",
    nombreCancha: "Patronato",
    deporte: "Futbol",
    tamanio: 5,
    turno: "201" 
} as unknown as Cancha;

const mockClub = {
    getId: () => "1",
    direccion: "Calle 1",
    nombreClub: "Central",
    telefono: "123",
    gmail: "a@a.com",
    valoracion: 4,
    getCanchas: () => [mockCancha1], // Club con una cancha asociada
} as unknown as Club;


describe('ClubController', () => {
    
    // Limpiar mocks antes de cada test
    beforeEach(() => {
        vi.clearAllMocks();
        // Resetear mockRequest
        mockRequest.params = {};
        mockRequest.body = {};
        
        // Configurar por defecto que getClub falle con 404 (para simular nuevo ID en add)
        (clubService.getClub as any).mockRejectedValue(new Error("Not Found"));
    });

    // --- addClub ---
    describe('addClub', () => {
        const clubData = { 
            id: "2", 
            direccion: "Calle 2", 
            nombreClub: "Club B", 
            telefono: "456", 
            gmail: "b@b.com", 
            valoracion: 5 
        };

        it('Deberia devolver 201 y el nuevo club al crearlo correctamente', async () => {
            // Arrange
            mockRequest.body = clubData;
            (clubService.addClub as any).mockResolvedValue(clubData);

            // Act
            await ClubController.addClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("2");
            expect(clubService.addClub).toHaveBeenCalledWith(expect.any(Club));
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(clubData);
        });

        it('Deberia devolver 409 si el ID del club ya existe (duplicacion)', async () => {
            // Arrange
            mockRequest.body = { ...clubData, id: "1" };
            
            // Mockeamos que getClub si encuentre el club (no lanza excepción)
            (clubService.getClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.addClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(clubService.addClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Ya existe un club con el ID 1." });
        });
        
        it('Deberia devolver 402 si falta el telefono', async () => {
            // Arrange
            mockRequest.body = { id: "3", direccion: "Calle 3", nombreClub: "Club C", gmail: "c@c.com", valoracion: 3 };
            
            // Act
            await ClubController.addClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Parametros incorrectos" });
            expect(clubService.addClub).not.toHaveBeenCalled();
        });
    });

    // --- editClub ---
    describe('editClub', () => {
        const updatedData = { 
            direccion: "Nueva Dir", 
            nombreClub: "Club Editado", 
            telefono: "999", 
            gmail: "edit@edit.com", 
            valoracion: 5 
        };
        const idToEdit = "1";

        it('Deberia devolver 200 y el club modificado', async () => {
            // Arrange
            mockRequest.params = { id: idToEdit };
            mockRequest.body = updatedData;
            
            // Mockeamos que el club exista
            (clubService.getClub as any).mockResolvedValue(mockClub); 
            (clubService.editClub as any).mockResolvedValue({ id: idToEdit, ...updatedData });

            // Act
            await ClubController.editClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith(idToEdit);
            expect(clubService.editClub).toHaveBeenCalledWith(idToEdit, updatedData.direccion, updatedData.nombreClub, updatedData.telefono, updatedData.gmail, updatedData.valoracion);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        
        it('Deberia devolver 404 si el Club a editar no existe', async () => {
            // Arrange
            mockRequest.params = { id: "99" };
            mockRequest.body = updatedData;
            
            // Mockeamos que getClub falle (404)
            const error = new Error("Club con ID 99 no encontrado");
            (clubService.getClub as any).mockRejectedValue(error);

            // Act
            await ClubController.editClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("99");
            expect(clubService.editClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });

        it('Deberia devolver 402 si falta el nombreClub en el body', async () => {
            // Arrange
            mockRequest.params = { id: idToEdit };
            mockRequest.body = { ...updatedData, nombreClub: undefined };
            
            // Act
            await ClubController.editClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Parametro de Club incorrectos" });
            expect(clubService.getClub).not.toHaveBeenCalled();
        });
    });
    
    // --- addCanchaAClub ---
    describe('addCanchaAClub', () => {
        const newCanchaData = { 
            nombreCancha: "River Plate", 
            deporte: "Voley", 
            tamanio: 2, 
            turno: "202" 
        };
        const newCanchaID = "102";

        it('Deberia devolver 200 y el club modificado al agregar una nueva cancha', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: newCanchaID };
            mockRequest.body = newCanchaData;
            
            // Mockeamos el Club (getCanchas no contiene 102)
            (clubService.getClub as any).mockResolvedValue(mockClub);
            (clubService.addCanchaAClub as any).mockResolvedValue({ ...mockClub, canchas: [mockCancha1, newCanchaData] });

            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(clubService.addCanchaAClub).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 409 si la cancha ya esta asociada al club (Caso duplicado)', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "101" }; // Usando 101 que ya esta en mockClub
            mockRequest.body = newCanchaData;
            
            // Mockeamos el Club (getCanchas si contiene 101)
            (clubService.getClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(clubService.addCanchaAClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "La cancha con ID 101 ya esta asociada al club 1." });
        });
        
        it('Deberia devolver 404 si el Club no existe', async () => {
            // Arrange
            mockRequest.params = { idClub: "99", idCancha: newCanchaID };
            mockRequest.body = newCanchaData;
            
            // Mockeamos que getClub lance error (404)
            const error = new Error("Club con ID 99 no encontrado");
            (clubService.getClub as any).mockRejectedValue(error);

            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("99");
            expect(clubService.addCanchaAClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
        
        it('Deberia devolver 402 si falta el nombreCancha en el body', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: newCanchaID };
            mockRequest.body = { ...newCanchaData, nombreCancha: undefined }; // Falta nombreCancha
            
            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(402);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Datos de la cancha incompletos o vacios" });
        });
    });
    
    // --- deleteCanchaAClub ---
    describe('deleteCanchaAClub', () => {
        it('Deberia devolver 200 al eliminar una cancha existente del club', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "101" };
            (clubService.getClub as any).mockResolvedValue(mockClub); // Simula que el club existe
            (clubService.deleteCanchaAClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.deleteCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(clubService.deleteCanchaAClub).toHaveBeenCalledWith("1", "101");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 404 si el Club no existe', async () => {
            // Arrange
            mockRequest.params = { idClub: "99", idCancha: "101" };
            const error = new Error("Club con ID 99 no encontrado");
            
            // Mockeamos que getClub lance error (404)
            (clubService.getClub as any).mockRejectedValue(error);

            // Act
            await ClubController.deleteCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("99");
            expect(clubService.deleteCanchaAClub).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
        
        it('Deberia devolver 404 si la cancha no existe en el club', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "999" };
            (clubService.getClub as any).mockResolvedValue(mockClub);
            
            // Mockeamos que el servicio de delete lance un error si la cancha no esta asociada
            const error = new Error("Cancha 999 no encontrada en Club 1");
            (clubService.deleteCanchaAClub as any).mockRejectedValue(error);

            // Act
            await ClubController.deleteCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(clubService.deleteCanchaAClub).toHaveBeenCalledWith("1", "999");
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});