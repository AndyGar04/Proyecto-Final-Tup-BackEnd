# Backend - Plataforma de Reservas de Canchas

## 📋 Descripción
Backend desarrollado en Node.js con TypeScript para la plataforma de reservas de canchas deportivas. Proporciona APIs RESTful para la gestión de usuarios, clubs, canchas, turnos y horarios.

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```text
src/
├── common/                 # Utilidades comunes
│   ├── errors.ts          # Clases de errores personalizados
│   └── security.ts        # Utilidades de seguridad (JWT)
├── controllers/           # Controladores de la API
│   ├── auth.controller.ts
│   ├── cancha.controller.ts
│   ├── club.controller.ts
│   ├── horario.controller.ts
│   └── turno.controller.ts
├── middlewares/           # Middlewares de Express
│   ├── auth.middleware.ts
│   └── validate.middleware.ts
├── models/               # Modelos de datos e interfaces
│   ├── implementations/  # Implementaciones Mock
│   ├── interface/        # Interfaces CRUD
│   └── *.ts             # Modelos de entidades
├── routes/               # Definición de rutas
├── schemas/              # Esquemas de validación (Zod)
├── services/             # Lógica de negocio
└── test/                 # Pruebas unitarias e2e
```

## 🚀 Características Principales

### 🔐 Autenticación y Autorización
- JWT-based authentication  
- Role-based access control (admin/user)  
- Password hashing con bcryptjs  
- Token verification middleware  
- Validación de esquemas con Zod  

### 📊 Entidades del Sistema
- **Usuarios:** Gestión de perfiles y roles  
- **Clubs:** Información de establecimientos deportivos  
- **Canchas:** Gestión de espacios deportivos  
- **Turnos:** Configuración de horarios y precios  
- **Horarios:** Disponibilidad temporal  

## 🛡️ Seguridad
- Validación de datos de entrada  
- Manejo centralizado de errores  
- Protección de endpoints sensibles  
- Sanitización de respuestas  

## 💻 Tecnologías Utilizadas
### Backend
- Node.js
- TypeScript
- Express.js
- JWT
- bcryptjs
- Zod
- CORS

### Testing
- Vitest
- Supertest

### Desarrollo
- TypeScript Compiler
- ts-node-dev

## ⚙️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
git clone <repository-url>
cd backend
npm install
cp .env.example .env
```

### Variables de Entorno
```env
PORT=3000
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion_123456789
JWT_EXPIRATION=24h
NODE_ENV=development
```

### Scripts Disponibles
```bash
npm run dev:ts
npm run dev:js
npm run build
npm run test
```

## 🎯 Endpoints de la API
### Autenticación (/auth)
- POST /auth/login  
- POST /auth/register  
- GET /auth/verify  
- GET /auth/usuarios  

### Clubs (/club)
- GET /club  
- GET /club/:id  
- POST /club  
- PUT /club/:id  
- DELETE /club/:id  
- PUT /club/:idClub/:idCancha  
- DELETE /club/:idClub/:idCancha  

### Canchas (/cancha)
- GET /cancha  
- GET /cancha/:id  
- POST /cancha  
- PUT /cancha/:id  
- DELETE /cancha/:id  

### Turnos (/turno)
- GET /turno  
- GET /turno/:id  
- POST /turno  
- PUT /turno/:id  
- DELETE /turno/:id  
- PUT /turno/:idTurno/:idHorario  
- DELETE /turno/:idTurno/:idHorario  

### Horarios (/horario)
- GET /horario  
- GET /horario/:id  
- POST /horario  
- PUT /horario/:id  
- DELETE /horario/:id  

## 🔐 Autenticación

### Registro
```json
POST /auth/register
{
  "nombre": "Usuario Ejemplo",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Login
```json
POST /auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Uso de Tokens
```
Authorization: Bearer <token_jwt>
```

## 🧪 Testing
```bash
npm run test
npm run test -- --watch
```

## 📊 Modelo de Datos

### Relaciones entre Entidades
```text
Club (1) ───── (N) Cancha (1) ───── (1) Turno (1) ───── (N) Horario
```

### Entidades Principales
- Usuario  
- Club  
- Cancha  
- Turno  
- Horario  

## 🔄 Flujos de Trabajo

### Reserva de Cancha
1. Usuario se autentica  
2. Consulta clubs y canchas  
3. Filtra por deporte y horarios  
4. Selecciona turno  
5. Confirma reserva  

### Gestión de Club
1. Admin gestiona clubs  
2. Añade/elimina canchas  
3. Configura turnos  
4. Gestiona horarios  

## 🚀 Despliegue
### Desarrollo
```bash
npm run dev:ts
```

### Producción
```bash
npm run build
npm start
```

## 📝 Licencia
Licencia ISC.

## 📞 Soporte
Contactar al equipo de desarrollo.

##  Documentación Interactiva

Para ver los ejemplos de requests, responses y probar la API directamente, podés acceder a nuestra colección documentada en Postman:

- **[Ver Documentación Completa en Postman](https://www.postman.com/andygar04/gestion-canchas-tup)**

## 🖼️ Diagrama ER

![Diagrama ER](/ImagenesReadme/DiagramaER.png)

## 🖼️ Diagrama UML

![Diagrama UML](/ImagenesReadme/UmlProyectoFinal.jpg)