import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../../services/auth.service'
import sqliteUsuario from '../../models/repository/sqliteUsuario'
import bcrypt from 'bcryptjs'
import { generateAccessToken } from '../../common/security'

// Mock del repositorio
vi.mock('../../models/repository/sqliteUsuario', () => ({
  default: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  }
}))

// Mock de bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true),
    hashSync: vi.fn().mockReturnValue('hashed-password-sync'),
    compareSync: vi.fn().mockReturnValue(true)
  }
}))

// Mock de las funciones de seguridad
vi.mock('../../common/security', () => ({
  generateAccessToken: vi.fn(),
  verifyAccessToken: vi.fn(),
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    authService = new AuthService(sqliteUsuario)
  })

  describe('login', () => {
    it('debería retornar null si el usuario no existe', async () => {
      // Arrange
      ;(sqliteUsuario.findByEmail as any).mockResolvedValue(null)

      // Act
      const result = await authService.login('nonexistent@test.com', 'password')

      // Assert
      expect(result).toBeNull()
      expect(sqliteUsuario.findByEmail).toHaveBeenCalledWith('nonexistent@test.com')
    })

    it('debería retornar null si la contraseña no coincide', async () => {
      // Arrange
      const mockUsuario = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        nombre: 'Test User',
        rol: 'user'
      }
      ;(sqliteUsuario.findByEmail as any).mockResolvedValue(mockUsuario)
      ;(bcrypt.compare as any).mockResolvedValue(false)

      // Act
      const result = await authService.login('test@test.com', 'wrong-password')

      // Assert
      expect(result).toBeNull()
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
    })

    it('debería retornar token y usuario si login exitoso', async () => {
      // Arrange
      const mockUsuario = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed-password',
        nombre: 'Test User',
        rol: 'user'
      }
      ;(sqliteUsuario.findByEmail as any).mockResolvedValue(mockUsuario)
      ;(bcrypt.compare as any).mockResolvedValue(true)
      ;(generateAccessToken as any).mockReturnValue('fake-jwt-token')

      // Act
      const result = await authService.login('test@test.com', 'correct-password')

      // Assert
      expect(result).toHaveProperty('token', 'fake-jwt-token')
      expect(result).toHaveProperty('usuario')
      expect(result?.usuario.email).toBe('test@test.com')
      expect(result?.usuario.password).toBeUndefined()
      expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-password')
    })
  })

describe('register', () => {
    it('debería crear usuario y retornar token', async () => {
      // Arrange
      const sqliteUsuarioMocked = vi.mocked(sqliteUsuario);
      sqliteUsuarioMocked.findByEmail.mockResolvedValueOnce(undefined);
      
      const mockUsuarioCreado = {
        id: 2,
        email: 'new@test.com',
        password: 'hashed-password',
        nombre: 'New User',
        rol: 'user'
      };
      
      sqliteUsuarioMocked.create.mockResolvedValueOnce(mockUsuarioCreado);
      const securityMocked = vi.mocked(generateAccessToken);
      securityMocked.mockReturnValueOnce('fake-jwt-token');

      // Act
      const result = await authService.register('New User', 'new@test.com', 'password');

      // Assert
      expect(sqliteUsuario.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token', 'fake-jwt-token');
      expect(result?.usuario.email).toBe('new@test.com');
      expect(result?.usuario.password).toBeUndefined();
    });
  });
})