import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response, NextFunction } from 'express'
import { authMiddleware, authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware'
import { verifyAccessToken } from '../../common/security'

// Mock de verifyAccessToken
vi.mock('../../common/security', () => ({
  verifyAccessToken: vi.fn()
}))

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    vi.clearAllMocks()
    mockRequest = {
      headers: {},
      method: 'POST'
    }
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    }
    mockNext = vi.fn()
  })

  describe('authMiddleware', () => {
    it('debería permitir métodos GET sin autenticación', () => {
      // Arrange
      mockRequest.method = 'GET'

      // Act
      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
      expect(verifyAccessToken).not.toHaveBeenCalled()
    })

    it('debería requerir token para métodos no-GET', () => {
      // Arrange
      mockRequest.method = 'POST'

      // Act
      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      )
    })

    it('debería permitir peticiones con token válido', () => {
      // Arrange
      mockRequest.method = 'POST'
      mockRequest.headers = { authorization: 'Bearer valid-token' }
      ;(verifyAccessToken as any).mockReturnValue({ id: 1, rol: 'user' })

      // Act
      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
      expect(mockRequest.usuario).toEqual({ id: 1, rol: 'user' })
    })
  })

  describe('authenticateToken', () => {
    it('debería rechazar peticiones sin token', () => {
      // Arrange
      mockRequest.headers = {}

      // Act
      authenticateToken(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('debería rechazar tokens inválidos', () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer invalid-token' }
      ;(verifyAccessToken as any).mockImplementation(() => {
        throw new Error('Token inválido')
      })

      // Act
      authenticateToken(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403)
    })
  })

  describe('authorizeRoles', () => {
    it('debería permitir acceso si el rol coincide', () => {
      // Arrange
      mockRequest.usuario = { rol: 'admin' }
      const middleware = authorizeRoles('admin', 'user')

      // Act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
    })

    it('debería denegar acceso si el rol no coincide', () => {
      // Arrange
      mockRequest.usuario = { rol: 'user' }
      const middleware = authorizeRoles('admin')

      // Act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403)
    })

    it('debería requerir usuario autenticado', () => {
      // Arrange
      mockRequest.usuario = undefined
      const middleware = authorizeRoles('admin')

      // Act
      middleware(mockRequest as Request, mockResponse as Response, mockNext)

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401)
    })
  })
})