import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioCrud } from '../models/interface/usuarioCrud';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_y_larga_y_muy_segura_y_muy_dificil';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

export class AuthService {
    private usuarioRepository: UsuarioCrud;

    constructor(usuarioRepository: UsuarioCrud) {
        this.usuarioRepository = usuarioRepository;
    }

    async login(email: string, password: string): Promise<{ token: string; usuario: any } | null> {
        const usuario = this.usuarioRepository.findByEmail(email);

        if (!usuario) {
            return null;
        }


        const passwordMatch = await bcrypt.compare(password, usuario.password);

        if (!passwordMatch) {
            return null;
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            JWT_SECRET
        );

        const { password: _, ...usuarioSinPassword } = usuario;

        return {
            token,
            usuario: usuarioSinPassword
        };
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}
