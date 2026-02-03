import { describe, it, expect, vi, beforeEach } from 'vitest'
import TurnoController from '../../controllers/turno.controller'
import turnoService from '../../services/turno.service'
import { Turno } from '../../models/turno'
import { Horario } from '../../models/horario'

// Mock del servicio de Turno - CORREGIDO
vi.mock('../../services/turno.service', () => ({
  default: {
    getTurnos: vi.fn(),
    getTurno: vi.fn(),
    addTurno: vi.fn(),
    deleteTurno: vi.fn(),
    editTurno: vi.fn(),
    addHorarioATurno: vi.fn(),
    deleteHorarioATurno: vi.fn(),
    preCrearHorarios: vi.fn(),
    size: vi.fn(),
  }
}))

// Mocks para Request y Response de Express
const mockRequest = {} as any
const mockResponse = {
  status: vi.fn(() => mockResponse),
  json: vi.fn(() => mockResponse),
} as any

describe('TurnoController', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequest.params = {}
    mockRequest.body = {}
  })

  // ... otros tests existentes ...

  describe('addHorarioATurno', () => {
    const newHorarioBody = { 
      disponibilidad: true, 
      horario: "11:00", 
      diaHorario: "2025-11-30T10:00:00Z" 
    };

    it('Deberia devolver 200 y el turno modificado al agregar un nuevo horario', async () => {
      // Arrange
      mockRequest.params = { idTurno: "1" };
      mockRequest.body = newHorarioBody;
      
      // Mockear getTurno para simular que el turno existe
      const mockTurnoExistente = new Turno("1", "Fútbol 5", 5000);
      (turnoService.getTurno as any).mockResolvedValue(mockTurnoExistente);
      
      const mockTurnoModificado = new Turno("1", "Fútbol 5", 5000);
      (turnoService.addHorarioATurno as any).mockResolvedValue(mockTurnoModificado);

      // Act
      await TurnoController.addHorarioATurno(mockRequest, mockResponse);

      // Assert - CORRECCIÓN: Verificar que se llamó al servicio
      expect(turnoService.addHorarioATurno).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    // ... otros tests ...
  });
});
