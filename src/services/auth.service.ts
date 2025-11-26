import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioCrud } from '../models/interface/usuarioCrud';
import { Usuario } from '../models/usuario';

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

    async register(nombre: string, email: string, password: string): Promise<{ token: string; usuario: any } | null> {

        const userExists = this.usuarioRepository.findByEmail(email);
        if (userExists) {
            throw new Error('El email ya está registrado');
        }

        const nuevoUsuario = new Usuario(0, email, password, nombre);
        
        const usuarioCreado = this.usuarioRepository.create(nuevoUsuario);

        const token = jwt.sign(
            {
                id: usuarioCreado.id,
                email: usuarioCreado.email,
                rol: usuarioCreado.rol
            },
            JWT_SECRET
        );

        const { password: _, ...usuarioSinPassword } = usuarioCreado;

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
