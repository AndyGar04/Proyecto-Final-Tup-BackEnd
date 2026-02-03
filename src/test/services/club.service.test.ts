import { describe, it, expect, vi, beforeEach } from 'vitest'
import clubService from '../../services/club.service'
import SQLiteClub from '../../models/repository/sqliteClub'
import SQLiteCancha from '../../models/repository/sqliteCancha'

// Mock de los repositorios
vi.mock('../../models/repository/sqliteClub', () => ({
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
}))

vi.mock('../../models/repository/sqliteCancha', () => ({
  default: {
    addCancha: vi.fn(),
  }
}))

describe('ClubService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getClubs', () => {
    it('debería llamar al repositorio y retornar clubs', async () => {
      // Arrange
      const mockClubs = [{ id: '1', nombreClub: 'Club Test' }]
      ;(SQLiteClub.getClubs as any).mockResolvedValue(mockClubs)

      // Act
      const result = await clubService.getClubs()

      // Assert
      expect(SQLiteClub.getClubs).toHaveBeenCalled()
      expect(result).toEqual(mockClubs)
    })
  })

  describe('addCanchaAClub', () => {
    it('debería agregar cancha y retornar club actualizado', async () => {
      // Arrange
      const mockCancha = { getId: () => '101', getNombreCancha: () => 'Cancha Test' }
      const mockClub = { id: '1', nombreClub: 'Club Test' }
      ;(SQLiteCancha.addCancha as any).mockResolvedValue(mockCancha)
      ;(SQLiteClub.getClub as any).mockResolvedValue(mockClub)

      // Act
      const result = await clubService.addCanchaAClub('1', mockCancha as any)

      // Assert
      expect(SQLiteCancha.addCancha).toHaveBeenCalledWith(mockCancha, '1')
      expect(SQLiteClub.getClub).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockClub)
    })
  })

  describe('deleteClub', () => {
    it('debería llamar al repositorio para eliminar club', () => {
      // Arrange
      const clubId = '1'

      // Act
      clubService.deleteClub(clubId)

      // Assert
      expect(SQLiteClub.deleteClub).toHaveBeenCalledWith(clubId)
    })
  })

  describe('size', () => {
    it('debería retornar el tamaño del repositorio', async () => {
      // Arrange
      ;(SQLiteClub.size as any).mockResolvedValue(5)

      // Act
      const result = await clubService.size()

      // Assert
      expect(result).toBe(5)
    })
  })
})