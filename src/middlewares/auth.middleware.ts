import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { MockUsuario } from '../models/implementations/mockUsuario';
import { AuthenticationError } from '../common/errors';
import { verifyAccessToken } from '../common/security';

const usuarioRepository = new MockUsuario();
const authService = new AuthService(usuarioRepository);

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        return next();
    }

    try {
        const authHeader = req.headers.authorization; 

        if (!authHeader) {
            throw new AuthenticationError("No se proporciono token de autenticacion");
        }

        const token = authHeader.split(' ')[1]; 
        
        if (!token) {
            throw new AuthenticationError("Formato de token invalido");
        }

        const userPayload = verifyAccessToken(token);
        req.usuario = userPayload;

        next();

    } catch (error) {
        if (error instanceof AuthenticationError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(401).json({ message: "Token invalido o expirado" });
    }
};

declare global {
    namespace Express {
        interface Request {
            usuario?: any;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({
                ok: false,
                message: 'Token no proporcionado'
            });
            return;
        }

        const decoded = authService.verifyToken(token);

        if (!decoded) {
            res.status(403).json({
                ok: false,
                message: 'Token inválido o expirado'
            });
            return;
        }

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
