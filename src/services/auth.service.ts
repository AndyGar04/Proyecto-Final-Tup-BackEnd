import bcrypt from 'bcryptjs';
import { UsuarioCrud } from '../models/interface/usuarioCrud';
import { Usuario } from '../models/usuario';
import { generateAccessToken, verifyAccessToken } from '../common/security';

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

        // USAMOS LA FUNCIÓN CENTRALIZADA
        const token = generateAccessToken({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        });

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

        const token = generateAccessToken({
            id: usuarioCreado.id,
            email: usuarioCreado.email,
            rol: usuarioCreado.rol
        });

        const { password: _, ...usuarioSinPassword } = usuarioCreado;

        return {
            token,
            usuario: usuarioSinPassword
        };
    }

    verifyToken(token: string): any {
        try {
            return verifyAccessToken(token);
        } catch (error) {
            return null;
        }
    }
}