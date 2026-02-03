import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClubController from '../../controllers/club.controller';
import clubService from '../../services/club.service';
import { Club } from '../../models/club';
import { Cancha } from '../../models/cancha';

// Mock de los servicios
vi.mock('../../services/club.service', () => ({
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
const mockCancha1 = new Cancha("101", "Patronato", "Futbol", "5", "201" as any);

const mockClub = new Club("1", "Calle 1", "Central", "123", "a@a.com", 4);
// Simulamos que el club tiene una cancha
(mockClub as any).canchas = [mockCancha1];

describe('ClubController', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest.params = {};
        mockRequest.body = {};
    });

    // --- addClub ---
    describe('addClub', () => {
        const clubData = { 
            direccion: "Calle 2", 
            nombreClub: "Club B", 
            telefono: "456", 
            gmail: "b@b.com", 
            valoracion: 5 
        };

        it('Deberia devolver 201 y el nuevo club al crearlo correctamente', async () => {
            // Arrange
            mockRequest.body = clubData;
            const clubCreado = { id: "2", ...clubData };
            (clubService.addClub as any).mockResolvedValue(clubCreado);

            // Act
            await ClubController.addClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.addClub).toHaveBeenCalledWith(expect.any(Club));
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(clubCreado);
        });
        
        it('Deberia devolver 400 si faltan parámetros obligatorios', async () => {
            // Arrange - Falta el teléfono
            mockRequest.body = { direccion: "Calle 3", nombreClub: "Club C", gmail: "c@c.com", valoracion: 3 };
            
            // Act
            await ClubController.addClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
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

        it('Deberia devolver 200 y el club modificado', async () => {
            // Arrange
            mockRequest.params = { id: "1" };
            mockRequest.body = updatedData;
            
            (clubService.getClub as any).mockResolvedValue(mockClub); 
            (clubService.editClub as any).mockResolvedValue({ id: "1", ...updatedData });

            // Act
            await ClubController.editClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
        
        it('Deberia devolver 400 si faltan parámetros en el cuerpo', async () => {
            // Arrange - Falta nombreClub
            mockRequest.params = { id: "1" };
            mockRequest.body = { ...updatedData, nombreClub: undefined };
            
            // Act
            await ClubController.editClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Parametro de Club incorrectos" });
        });
    });
    
    // --- addCanchaAClub ---
    describe('addCanchaAClub', () => {
        const newCanchaBody = { 
            nombreCancha: "River Plate", 
            deporte: "Voley", 
            tamanio: 2, 
            idTurno: "202" // Usamos idTurno segun el controlador
        };

        it('Deberia devolver 200 al agregar una nueva cancha', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "102" };
            mockRequest.body = newCanchaBody;
            
            // Simular club sin la cancha 102
            (clubService.getClub as any).mockResolvedValue(mockClub);
            (clubService.addCanchaAClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(clubService.getClub).toHaveBeenCalledWith("1");
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 409 si la cancha ya existe en el club', async () => {
            // Arrange - idCancha "101" ya está en el mockClub
            mockRequest.params = { idClub: "1", idCancha: "101" };
            mockRequest.body = newCanchaBody;
            
            (clubService.getClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                message: "La cancha con ID 101 ya esta asociada al club 1." 
            });
        });
        
        it('Deberia devolver 400 si los datos de la cancha están incompletos', async () => {
            // Arrange - Falta idTurno
            mockRequest.params = { idClub: "1", idCancha: "102" };
            mockRequest.body = { nombreCancha: "Error" }; 
            
            // Act
            await ClubController.addCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "Datos de la cancha incompletos o vacios" });
        });
    });
    
    // --- deleteCanchaAClub ---
    describe('deleteCanchaAClub', () => {
        it('Deberia devolver 200 al eliminar con éxito', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "101" };
            (clubService.getClub as any).mockResolvedValue(mockClub);
            (clubService.deleteCanchaAClub as any).mockResolvedValue(mockClub);

            // Act
            await ClubController.deleteCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('Deberia devolver 404 si el servicio lanza error', async () => {
            // Arrange
            mockRequest.params = { idClub: "1", idCancha: "999" };
            (clubService.getClub as any).mockResolvedValue(mockClub);
            const error = new Error("Cancha no encontrada");
            (clubService.deleteCanchaAClub as any).mockRejectedValue(error);

            // Act
            await ClubController.deleteCanchaAClub(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: error.message });
        });
    });
});
