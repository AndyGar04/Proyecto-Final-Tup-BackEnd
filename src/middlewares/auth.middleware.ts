import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { MockUsuario } from '../models/implementations/mockUsuario';

const usuarioRepository = new MockUsuario();
const authService = new AuthService(usuarioRepository);

// Se extiende la interfaz Request para incluir el usuario autenticado
declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                ok: false,
                message: 'Token no proporcionado'
            });
            return;
        }

        // Verificar el token
        const decoded = authService.verifyToken(token);

        if (!decoded) {
            res.status(403).json({
                ok: false,
                message: 'Token inválido o expirado'
            });
            return;
        }

        // Agregar los datos del usuario decodificados al request
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar roles específicos
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.usuario) {
            res.status(401).json({
                ok: false,
                message: 'Usuario no autenticado'
            });
            return;
        }

        if (!roles.includes(req.usuario.rol)) {
            res.status(403).json({
                ok: false,
                message: 'No tienes permisos para acceder a este recurso'
            });
            return;
        }

        next();
    };
};
