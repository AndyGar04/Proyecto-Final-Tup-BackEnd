import bcrypt from 'bcryptjs';
import { Usuario } from '../usuario';
import { UsuarioCrud } from '../interface/usuarioCrud';

export class MockUsuario implements UsuarioCrud {
    private usuarios: Usuario[] = [];
    private nextId: number = 1;

    constructor() {
        this.initializeMockData();
    }

    private async initializeMockData() {
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const userPassword = bcrypt.hashSync('user123', 10);
        const testPassword = bcrypt.hashSync('test123', 10);

        this.usuarios = [
            new Usuario(this.nextId++, 'admin@test.com', adminPassword, 'Administrador', 'admin'),
            new Usuario(this.nextId++, 'user@test.com', userPassword, 'Usuario Prueba', 'user'),
            new Usuario(this.nextId++, 'test@test.com', testPassword, 'Test User', 'user'),
        ];
    }

    findByEmail(email: string): Usuario | undefined {
        return this.usuarios.find(u => u.email === email);
    }

    findById(id: number): Usuario | undefined {
        return this.usuarios.find(u => u.id === id);
    }

    getAll(): Usuario[] {
        return this.usuarios.map(u => {
            // Retornar sin la contraseña por seguridad
            const { password, ...userWithoutPassword } = u;
            return { ...userWithoutPassword, password: '' } as Usuario;
        });
    }

    create(usuario: Usuario): Usuario {
        usuario.id = this.nextId++;
        usuario.password = bcrypt.hashSync(usuario.password, 10);
        this.usuarios.push(usuario);
        return usuario;
    }
}
