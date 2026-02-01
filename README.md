# Backend - Plataforma de Reservas de Canchas

Sistema backend robusto desarrollado en Node.js con TypeScript para la gestión integral de reservas de canchas deportivas. Proporciona una API RESTful completa para la administración de usuarios, establecimientos deportivos, canchas, turnos y horarios disponibles.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Endpoints de la API](#endpoints-de-la-api)
- [Autenticación](#autenticación)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Modelo de Datos](#modelo-de-datos)
- [Diagramas](#diagramas)
- [Documentación Interactiva](#documentación-interactiva)
- [Despliegue](#despliegue)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

Este proyecto implementa el backend de una plataforma de reservas de canchas deportivas, diseñado con una arquitectura modular y escalable. El sistema permite a los usuarios buscar, filtrar y reservar canchas en diferentes clubes deportivos, mientras que los administradores pueden gestionar la infraestructura completa del sistema.

### Características Destacadas

- API RESTful completamente funcional
- Autenticación y autorización basada en JWT
- Control de acceso basado en roles (RBAC)
- Validación robusta de datos con Zod
- Base de datos SQLite con soporte para migraciones
- Arquitectura de capas (Controller-Service-Repository)
- Testing automatizado con Vitest
- Manejo centralizado de errores
- Seguridad implementada en todos los niveles

## Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas que separa las responsabilidades y facilita el mantenimiento y escalabilidad del código:

- **Controllers**: Manejan las peticiones HTTP y delegan la lógica de negocio a los servicios
- **Services**: Contienen la lógica de negocio y orquestan las operaciones
- **Repository**: Abstracción de acceso a datos, implementado con el patrón Repository
- **Models**: Definición de entidades y estructuras de datos
- **Middlewares**: Funciones intermedias para autenticación, validación y manejo de errores
- **Routes**: Definición de endpoints y asociación con controladores

### Estructura de Carpetas
```text
src/
├── common/                 # Utilidades comunes
│   ├── errors.ts          # Clases de errores personalizados
│   └── security.ts        # Utilidades de seguridad (JWT, bcrypt)
├── controllers/           # Controladores de la API
│   ├── auth.controller.ts
│   ├── cancha.controller.ts
│   ├── club.controller.ts
│   ├── horario.controller.ts
│   └── turno.controller.ts
├── database/              # Configuración de base de datos
│   └── database.ts        # Conexión y configuración de SQLite
├── middlewares/           # Middlewares de Express
│   ├── auth.middleware.ts      # Validación de JWT y roles
│   └── validate.middleware.ts  # Validación de esquemas
├── models/                # Modelos de datos e interfaces
│   ├── implementations/   # Implementaciones Mock para testing
│   ├── interface/         # Interfaces CRUD
│   ├── repository/        # Implementaciones de repositorios (Turso DB)
│   └── *.ts              # Modelos de entidades
├── routes/                # Definición de rutas
│   ├── auth.routes.ts
│   ├── cancha.routes.ts
│   ├── club.routes.ts
│   ├── horario.routes.ts
│   └── turno.routes.ts
├── schemas/               # Esquemas de validación (Zod)
│   └── auth.schema.ts
├── scripts/               # Scripts de utilidad
│   └── initAdmin.ts       # Inicialización de usuario administrador
├── services/              # Lógica de negocio
│   ├── auth.service.ts
│   ├── cancha.service.ts
│   ├── club.service.ts
│   ├── horario.service.ts
│   └── turno.service.ts
├── test/                  # Pruebas unitarias e integración
│   ├── cancha/
│   ├── club/
│   └── user/
├── app.ts                 # Configuración de Express
└── index.ts               # Punto de entrada de la aplicación
```

## Características Principales

### Autenticación y Autorización
- Autenticación basada en JSON Web Tokens (JWT)
- Control de acceso basado en roles (RBAC) con niveles de administrador y usuario
- Hashing de contraseñas con bcryptjs para máxima seguridad
- Middleware de verificación de tokens y permisos
- Validación estricta de esquemas con Zod
- Gestión segura de sesiones y tokens de expiración configurable

### Entidades del Sistema
- **Usuarios**: Gestión completa de perfiles, autenticación y roles
- **Clubs**: Administración de establecimientos deportivos con información detallada
- **Canchas**: Gestión de espacios deportivos asociados a clubs
- **Turnos**: Configuración de horarios disponibles y precios por cancha
- **Horarios**: Gestión de disponibilidad temporal y reservas

### Seguridad
- Validación exhaustiva de datos de entrada en todos los endpoints
- Manejo centralizado de errores con respuestas estandarizadas
- Protección de endpoints sensibles mediante middleware de autenticación
- Sanitización de respuestas para prevenir exposición de datos sensibles
- CORS configurado para controlar acceso desde diferentes orígenes
- Headers de seguridad HTTP implementados  

## Tecnologías Utilizadas

### Runtime y Lenguaje
- **Node.js**: Entorno de ejecución JavaScript del lado del servidor
- **TypeScript**: Superset de JavaScript con tipado estático

### Framework y Librerías Core
- **Express.js**: Framework web minimalista y flexible
- **CORS**: Middleware para configuración de Cross-Origin Resource Sharing
- **Morgan**: Logger HTTP para Node.js
- **Dotenv**: Gestión de variables de entorno

### Seguridad y Autenticación
- **jsonwebtoken**: Implementación de JWT para autenticación
- **bcryptjs**: Librería de hashing para contraseñas
- **Zod**: Validación y parsing de esquemas TypeScript-first

### Base de Datos
- **Turso**: Base de datos distribuida basada en libSQL (fork de SQLite)
- **@libsql/client**: Cliente oficial de libSQL para conexión con Turso

### Testing
- **Vitest**: Framework de testing unitario rápido
- **Supertest**: Librería para testing de endpoints HTTP
- **@vitest/ui**: Interfaz visual para Vitest
- **@faker-js/faker**: Generación de datos de prueba

### Herramientas de Desarrollo
- **TypeScript Compiler**: Compilador de TypeScript
- **ts-node-dev**: Ejecución y recarga automática de TypeScript en desarrollo

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior) o **yarn**
- **Git** para clonar el repositorio

## Instalación

1. Clone el repositorio:
```bash
git clone <repository-url>
cd Proyecto-Final-Tup-BackEnd
```

2. Instale las dependencias:
```bash
npm install
```

3. Configure las variables de entorno (ver sección de Configuración)

**Nota**: La base de datos ya está desplegada en Turso con los usuarios iniciales configurados.

## Configuración

### Variables de Entorno

Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Configuración JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_123456789
JWT_EXPIRATION=24h

# Entorno de ejecución
NODE_ENV=development

# Base de datos Turso
TURSO_DATABASE_URL=libsql://tu-database.turso.io
TURSO_AUTH_TOKEN=tu_token_de_autenticacion
```

**Importante**: Cambie el valor de `JWT_SECRET` por una clave segura y única en producción.

### Scripts Disponibles

```bash
# Desarrollo con TypeScript (recomendado)
npm run dev:ts

# Desarrollo con JavaScript compilado
npm run dev:js

# Compilar TypeScript
npm run build

# Ejecutar tests
npm run test

# Inicializar base de datos y crear admin
npm run init:db
```

## Ejecución

### Modo Desarrollo

Para ejecutar el servidor en modo desarrollo con recarga automática:

```bash
npm run dev:ts
```

El servidor estará disponible en `http://localhost:3000`

### Modo Producción

1. Compile el código TypeScript:
```bash
npm run build
```

2. Ejecute el servidor:
```bash
node dist/index.js
```

## Endpoints de la API

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/register` | Registrar nuevo usuario | No |
| GET | `/auth/verify` | Verificar token JWT | Sí |
| GET | `/auth/usuarios` | Listar todos los usuarios | Sí (Admin) |

### Clubs (`/club`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/club` | Listar todos los clubs | No |
| GET | `/club/:id` | Obtener club por ID | No |
| POST | `/club` | Crear nuevo club | Sí (Admin) |
| PUT | `/club/:id` | Actualizar club | Sí (Admin) |
| DELETE | `/club/:id` | Eliminar club | Sí (Admin) |
| PUT | `/club/:idClub/:idCancha` | Asociar cancha a club | Sí (Admin) |
| DELETE | `/club/:idClub/:idCancha` | Desasociar cancha de club | Sí (Admin) |

### Canchas (`/cancha`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/cancha` | Listar todas las canchas | No |
| GET | `/cancha/:id` | Obtener cancha por ID | No |
| POST | `/cancha` | Crear nueva cancha | Sí (Admin) |
| PUT | `/cancha/:id` | Actualizar cancha | Sí (Admin) |
| DELETE | `/cancha/:id` | Eliminar cancha | Sí (Admin) |

### Turnos (`/turno`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/turno` | Listar todos los turnos | No |
| GET | `/turno/:id` | Obtener turno por ID | No |
| POST | `/turno` | Crear nuevo turno | Sí (Admin) |
| PUT | `/turno/:id` | Actualizar turno | Sí (Admin) |
| DELETE | `/turno/:id` | Eliminar turno | Sí (Admin) |
| PUT | `/turno/:idTurno/:idHorario` | Asociar horario a turno | Sí (Admin) |
| DELETE | `/turno/:idTurno/:idHorario` | Desasociar horario de turno | Sí (Admin) |

### Horarios (`/horario`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/horario` | Listar todos los horarios | No |
| GET | `/horario/:id` | Obtener horario por ID | No |
| POST | `/horario` | Crear nuevo horario | Sí (Admin) |
| PUT | `/horario/:id` | Actualizar horario | Sí (Admin) |
| DELETE | `/horario/:id` | Eliminar horario | Sí (Admin) |  

## Autenticación

El sistema utiliza JSON Web Tokens (JWT) para la autenticación. Todos los endpoints protegidos requieren un token válido en el header de autorización.

### Registro de Usuario

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "nombre": "Usuario Ejemplo",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response**: 
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1
}
```

### Inicio de Sesión

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Usuario Ejemplo",
    "email": "usuario@ejemplo.com",
    "rol": "user"
  }
}
```

### Uso de Tokens

Para acceder a endpoints protegidos, incluya el token JWT en el header de autorización:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificación de Token

**Endpoint**: `GET /auth/verify`

**Headers**: 
```
Authorization: Bearer <token_jwt>
```

**Response**:
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "rol": "user"
  }
}
```

## Base de Datos

El proyecto utiliza **Turso** como base de datos, una plataforma distribuida basada en libSQL (fork de SQLite) optimizada para edge computing y baja latencia global.

### Características

- Base de datos distribuida con Turso
- Compatible con sintaxis SQLite
- Baja latencia y alta disponibilidad
- Repositorios implementados con el patrón Repository
- Implementaciones Mock disponibles para testing
- Conexión mediante @libsql/client

### Configuración de Conexión

La conexión a Turso requiere dos variables de entorno:

```env
TURSO_DATABASE_URL=libsql://tu-database.turso.io
TURSO_AUTH_TOKEN=tu_token_de_autenticacion
```

Estas credenciales se obtienen desde el dashboard de Turso al crear la base de datos.

### Estado Actual

La base de datos ya está desplegada y configurada con:
- Esquema de tablas completo
- Usuarios administradores iniciales
- Datos de prueba si aplica

**Nota para Desarrollo Local**: Si necesita inicializar una base de datos local para desarrollo, puede usar el script:

```bash
npm run init:db
```

Este script está disponible para configuración inicial en entornos de desarrollo local con SQLite.

### Estructura de Tablas

- `usuarios`: Información de usuarios y autenticación
- `clubs`: Datos de establecimientos deportivos
- `canchas`: Espacios deportivos asociados a clubs
- `turnos`: Configuración de horarios y precios
- `horarios`: Disponibilidad temporal de turnos

## Testing

El proyecto cuenta con una suite completa de tests unitarios y de integración implementados con Vitest.

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test -- --watch

# Ejecutar tests con interfaz visual
npm run test -- --ui

# Ejecutar tests con cobertura
npm run test -- --coverage
```

### Estructura de Tests

```text
src/test/
├── cancha/
│   ├── cancha.controller.test.ts
│   └── sqliteCancha.test.ts
├── club/
│   ├── club.test.ts
│   └── sqliteClub.test.ts
├── user/
│   ├── mockUsuario.test.ts
│   ├── sqliteUsuario.test.ts
│   └── usuario.test.ts
├── horario.test.ts
├── sqliteHorario.test.ts
└── turno.test.ts
```

### Tipos de Tests

- **Tests Unitarios**: Validación de lógica de negocio y funciones individuales
- **Tests de Integración**: Validación de endpoints y flujos completos
- **Tests de Repositorio**: Validación de operaciones de base de datos
- **Tests Mock**: Validación con datos simulados para desarrollo aislado

## Modelo de Datos

### Relaciones entre Entidades

```text
┌──────────┐
│ Usuario  │
└──────────┘

┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│   Club   │────<>│  Cancha  │──────│  Turno   │────<>│ Horario  │
└──────────┘ 1:N  └──────────┘ 1:1  └──────────┘ 1:N  └──────────┘
```

### Entidades Principales

#### Usuario
- `id`: Identificador único
- `nombre`: Nombre completo del usuario
- `email`: Correo electrónico (único)
- `password`: Contraseña hasheada
- `rol`: Rol del usuario (admin/user)
- `createdAt`: Fecha de creación

#### Club
- `id`: Identificador único
- `nombre`: Nombre del club
- `direccion`: Dirección física
- `telefono`: Teléfono de contacto
- `email`: Email de contacto
- `descripcion`: Descripción del establecimiento
- `canchas`: Array de IDs de canchas asociadas

#### Cancha
- `id`: Identificador único
- `nombre`: Nombre de la cancha
- `tipo`: Tipo de deporte (fútbol, tenis, paddle, etc.)
- `capacidad`: Número de jugadores
- `techada`: Indica si está techada
- `idClub`: ID del club al que pertenece
- `idTurno`: ID del turno configurado

#### Turno
- `id`: Identificador único
- `nombre`: Nombre descriptivo del turno
- `duracion`: Duración en minutos
- `precio`: Precio por turno
- `horarios`: Array de IDs de horarios disponibles

#### Horario
- `id`: Identificador único
- `fecha`: Fecha del horario
- `horaInicio`: Hora de inicio
- `horaFin`: Hora de finalización
- `disponible`: Estado de disponibilidad
- `idTurno`: ID del turno al que pertenece  

## Diagramas

### Diagrama de Entidad-Relación (ER)

El siguiente diagrama muestra la estructura de la base de datos y las relaciones entre las entidades:

![Diagrama ER](ImagenesReadme/DiagramaER.png)

### Diagrama UML

Diagrama de clases que representa la arquitectura del sistema:

![Diagrama UML](ImagenesReadme/UmlProyectoFinal.jpg)

## Documentación Interactiva

Para ver ejemplos detallados de requests, responses y probar la API directamente, puede acceder a la colección documentada en Postman:

**[Ver Documentación Completa en Postman](https://www.postman.com/speeding-rocket-722542/workspace/gestion-canchas-tup)**

La documentación incluye:
- Ejemplos de todas las peticiones
- Esquemas de respuesta
- Variables de entorno preconfiguradas
- Tests automáticos de validación

## Despliegue

### Desarrollo

Para ejecutar el servidor en modo desarrollo:

```bash
npm run dev:ts
```

El servidor se ejecutará en `http://localhost:3000` con recarga automática ante cambios.

### Producción

1. **Compile el código**:
```bash
npm run build
```

2. **Configure las variables de entorno** apropiadas para producción

3. **Ejecute el servidor**:
```bash
node dist/index.js
```

### Consideraciones para Producción

- La base de datos Turso ya está configurada para producción
- Configure un reverse proxy (nginx, Apache) si es necesario
- Implemente rate limiting y otras medidas de seguridad
- Configure logs persistentes
- Utilice variables de entorno seguras
- Implemente monitoreo y alertas
- Turso maneja automáticamente backups y réplicas

### Despliegue en Vercel

El proyecto está configurado para desplegarse en Vercel. El archivo `vercel.json` contiene la configuración necesaria.

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

## Contribución

### Cómo Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Cree una rama para su feature (`git checkout -b feature/AmazingFeature`)
3. Commit sus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abra un Pull Request

### Convenciones de Código

- Utilice TypeScript para todo el código nuevo
- Siga las convenciones de naming de JavaScript/TypeScript
- Escriba tests para nuevas funcionalidades
- Documente funciones y clases complejas
- Mantenga los commits atómicos y descriptivos

### Estándares de Commits

Utilice el formato convencional de commits:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `test:` Añadir o modificar tests
- `refactor:` Refactorización de código
- `style:` Cambios de formato
- `chore:` Tareas de mantenimiento

### Reporte de Bugs

Para reportar bugs, abra un issue incluyendo:

- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Capturas de pantalla si aplica
- Entorno (OS, versión de Node, etc.)

## Licencia

Este proyecto está bajo la Licencia ISC.

## Contacto y Soporte

Para soporte técnico o consultas sobre el proyecto:

- Abra un issue en el repositorio
- Contacte al equipo de desarrollo

---

**Desarrollado por el equipo de TUP - Proyecto Final**