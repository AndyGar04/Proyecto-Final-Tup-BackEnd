# Implementación SQLite Usuario

## Cambios Realizados

### 1. Repositorio SQLite Usuario
Se creó el archivo `src/models/repository/sqliteUsuario.ts` que implementa la interfaz `UsuarioCrud` utilizando SQLite como base de datos.

**Características:**
- `findByEmail(email)`: Busca un usuario por su email
- `findById(id)`: Busca un usuario por su ID
- `getAll()`: Obtiene todos los usuarios
- `create(usuario)`: Crea un nuevo usuario con contraseña hasheada (bcrypt con 10 rounds)

### 2. Base de Datos
Se agregó la tabla `usuarios` en `src/database/database.ts`:
```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'user'
)
```

### 3. Actualización de Interfaces
La interfaz `UsuarioCrud` ahora utiliza Promises (async/await):
```typescript
export interface UsuarioCrud {
    findByEmail(email: string): Promise<Usuario | undefined>;
    findById(id: number): Promise<Usuario | undefined>;
    getAll(): Promise<Usuario[]>;
    create(usuario: Usuario): Promise<Usuario>;
}
```

### 4. Servicios y Controladores
- `auth.controller.ts`: Actualizado para usar `sqliteUsuario` en lugar de `MockUsuario`
- `auth.service.ts`: Actualizado con `await` en los métodos `login` y `register`
- `auth.middleware.ts`: Actualizado para usar `sqliteUsuario`

### 5. Script de Inicialización
Se creó `src/scripts/initAdmin.ts` para inicializar usuarios por defecto:
- **Admin:** admin@test.com / admin123
- **Usuario:** user@test.com / user123

### 6. Tests Actualizados
- `mockUsuario.test.ts`: Actualizado para usar async/await
- `MockUsuario`: Optimizado con bcrypt rounds más bajos (4) para tests más rápidos

## Uso

### Inicializar Base de Datos
- Script para cargar los usuarios en la base de datos

```bash
npm run init:db
```

### Usuarios por Defecto
Después de ejecutar el script de inicialización:
- **Email:** admin@test.com | **Password:** admin123 | **Rol:** admin
- **Email:** user@test.com | **Password:** user123 | **Rol:** user

### Autenticación
La autenticación funciona de la misma manera que antes, pero ahora usa SQLite en lugar de datos en memoria.

**Endpoint de Login:**
```
POST /api/auth/login
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Endpoint de Registro:**
```
POST /api/auth/register
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@test.com",
  "password": "password123"
}
```

## Seguridad
- Las contraseñas se hashean con bcrypt (10 rounds en producción)
- Los tokens JWT se generan y validan correctamente
- La tabla usuarios tiene constraint UNIQUE en el email
