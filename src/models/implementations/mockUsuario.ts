import bcrypt from 'bcryptjs';
import { Usuario } from '../usuario';
import { UsuarioCrud } from '../interface/usuarioCrud';

export class MockUsuario implements UsuarioCrud {
    private usuarios: Usuario[] = [];
    private nextId: number = 1;

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        // Se usa rounds bajas para que pasen los tests, en producción seguimos usando 10
        const rounds = 4;
        const adminPassword = bcrypt.hashSync('admin123', rounds);
        const userPassword = bcrypt.hashSync('user123', rounds);
        const testPassword = bcrypt.hashSync('test123', rounds);

        this.usuarios = [
            new Usuario(this.nextId++, 'admin@test.com', adminPassword, 'Administrador', 'admin'),
            new Usuario(this.nextId++, 'user@test.com', userPassword, 'Usuario Prueba', 'user'),
            new Usuario(this.nextId++, 'test@test.com', testPassword, 'Test User', 'user'),
        ];
    }

    async findByEmail(email: string): Promise<Usuario | undefined> {
        return this.usuarios.find(u => u.email === email);
    }

    async findById(id: number): Promise<Usuario | undefined> {
        return this.usuarios.find(u => u.id === id);
    }

    async getAll(): Promise<Usuario[]> {
        return this.usuarios.map(u => {
            // Retornar sin la contraseña por seguridad
            const { password, ...userWithoutPassword } = u;
            return { ...userWithoutPassword, password: '' } as Usuario;
        });
    }

    async create(usuario: Usuario): Promise<Usuario> {
        usuario.id = this.nextId++;
        // Usar rondas más bajas para tests (más rápido)
        usuario.password = bcrypt.hashSync(usuario.password, 4);
        this.usuarios.push(usuario);
        return usuario;
    }
}
