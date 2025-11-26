import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { MockUsuario } from '../models/implementations/mockUsuario';

const usuarioRepository = new MockUsuario();
const authService = new AuthService(usuarioRepository);

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validar el envio de email y password
        if (!email || !password) {
            res.status(400).json({
                ok: false,
                message: 'Email y contraseña son requeridos'
            });
            return;
        }

        // Intentar hacer login
        const result = await authService.login(email, password);

        if (!result) {
            res.status(401).json({
                ok: false,
                message: 'Credenciales inválidas'
            });
            return;
        }

        // Login exitoso
        res.status(200).json({
            ok: true,
            message: 'Login exitoso',
            token: result.token,
            usuario: result.usuario
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const {nombre, email, password} = req.body;

        if(!nombre || !email || !password) {
            res.status(400).json({
                ok: false,
                message: 'Se requiere nombre, mail y contraseña'
            })
        }

        const result = await authService.register(nombre, email, password);
        
        res.status(201).json({
            ok: true,
            message: 'Registro exitoso',
            token: result?.token,
            usuario: result?.usuario
        });
    } catch (error: any) {
        console.error('Error en registro:', error);
        res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor'
        });
    }
}

export const verificarToken = (req: Request, res: Response): void => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({
                ok: false,
                message: 'Token no proporcionado'
            });
            return;
        }

        const decoded = authService.verifyToken(token);

        if (!decoded) {
            res.status(401).json({
                ok: false,
                message: 'Token inválido o expirado'
            });
            return;
        }

        res.status(200).json({
            ok: true,
            message: 'Token válido',
            usuario: decoded
        });
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};

export const getAllUsuarios = (req: Request, res: Response): void => {
    try {
        const usuarios = usuarioRepository.getAll();

        res.status(200).json({
            ok: true,
            message: 'Usuarios obtenidos exitosamente',
            usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            ok: false,
            message: 'Error interno del servidor'
        });
    }
};
