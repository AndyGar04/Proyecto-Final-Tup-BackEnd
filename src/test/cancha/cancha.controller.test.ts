import { describe, it, expect, vi, beforeEach } from 'vitest';
import CanchaController from '../../controllers/cancha.controller';
import canchaService from '../../services/cancha.service';
import turnoService from '../../services/turno.service';
import { Cancha } from '../../models/cancha';
import { Turno } from '../../models/turno';

// Mock de los servicios
vi.mock('../../services/cancha.service', () => ({
  default: {
    getCanchas: vi.fn(),
    getCancha: vi.fn(),
    addCancha: vi.fn(),
    deleteCancha: vi.fn(),
    editCancha: vi.fn(),
    size: vi.fn(),
  }
}));

vi.mock('../../services/turno.service', () => ({
  default: {
    getTurno: vi.fn(),
  }
}));

// Mocks para Request y Response de Express
const mockRequest = {} as any;
const mockResponse = {
  status: vi.fn(function(this: any) { return this; }),
  json: vi.fn(function(this: any) { return this; }),
} as any;

// Datos de prueba
const mockTurno = new Turno("100", "Futbol 5", 5000);
const mockCancha = new Cancha("1", "Central", "Futbol", "5", mockTurno);

describe('CanchaController', () => {
    
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequest.params = {};
    mockRequest.body = {};
  });

  describe('addCancha', () => {
        const canchaDataBody = { 
        nombreCancha: "Auxiliar", 
        deporte: "Tenis", 
        tamanio: "2", 
        idTurno: "100",
        idClub: "1" 
        };

        it('Deberia devolver 404 si el Turno asociado no existe', async () => {
        // Arrange
        mockRequest.body = canchaDataBody;
        const turnoMocked = vi.mocked(turnoService);
        turnoMocked.getTurno.mockRejectedValueOnce(new Error("Turno no encontrado"));

        // Act
        await CanchaController.addCancha(mockRequest, mockResponse);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        });
            
        it('Deberia devolver 400 si faltan parámetros (clubId, idTurno, etc.)', async () => {
            // Arrange
            mockRequest.body = { nombreCancha: "Test", deporte: "Tenis", tamanio: "2", idTurno: "100" }; // Falta clubId
            
            // Act
            await CanchaController.addCancha(mockRequest, mockResponse);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });
    });
    
     describe('editCancha', () => {
        const editBody = { 
        nombreCancha: "Principal Editada", 
        deporte: "Voley", 
        tamanio: "6", 
        idTurno: "102" 
        };

        it('Deberia devolver 200 y la cancha modificada', async () => {
        // Arrange
        mockRequest.params = { id: "1" };
        mockRequest.body = editBody;
        
        const mocked = vi.mocked(canchaService);
        const turnoMocked = vi.mocked(turnoService);
        const editedCancha = new Cancha("1", "Principal Editada", "Voley", "6", new Turno("102", "Test", 5000));
        mocked.getCancha.mockResolvedValueOnce(mockCancha);
        turnoMocked.getTurno.mockResolvedValueOnce(new Turno("102", "Test", 5000));
        mocked.editCancha.mockResolvedValueOnce(editedCancha);

        // Act
        await CanchaController.editCancha(mockRequest, mockResponse);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });

    // --- deleteCancha ---
    describe('deleteCancha', () => {
        it('Deberia devolver 200 al eliminar con éxito', async () => {
        // Arrange
        mockRequest.params = { id: "1" };
        const mocked = vi.mocked(canchaService);
        mocked.deleteCancha.mockResolvedValueOnce(undefined);

        // Act
        await CanchaController.deleteCancha(mockRequest, mockResponse);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });
});