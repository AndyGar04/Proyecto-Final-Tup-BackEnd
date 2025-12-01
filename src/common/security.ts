import jwt from 'jsonwebtoken';
import { AuthenticationError } from './errors';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_y_larga';

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new AuthenticationError('Token inválido o expirado');
    }
};

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};