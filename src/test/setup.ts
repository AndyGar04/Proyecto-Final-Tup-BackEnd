import { vi } from 'vitest'
import dotenv from 'dotenv'
import { rm } from 'fs/promises'
import { join } from 'path'

// Cargar variables de entorno ANTES de cualquier otra cosa
dotenv.config({ path: '.env.test' })

// Configurar variables de entorno para tests usando :memory: para evitar bloqueos SQLite
process.env.TURSO_DATABASE_URL = 'file::memory:?cache=shared'
process.env.TURSO_AUTH_TOKEN = 'test-token'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.NODE_ENV = 'test'

// Importar initDb DESPUÉS de que las variables estén configuradas
;(async () => {
  const { initDb } = await import('../database/database.js')

  // Inicializar la base de datos con las tablas necesarias
  await initDb()
})()

// Mock para las funciones de JWT (no mockeamos bcryptjs porque es esencial para la lógica)
vi.mock('../common/security', () => ({
  verifyAccessToken: vi.fn(),
  generateAccessToken: vi.fn(),
}))