import { describe, it, expect, beforeEach } from 'vitest';
import { MockUsuario } from '../../models/implementations/mockUsuario';
import { Usuario } from '../../models/usuario';
import bcrypt from 'bcryptjs';

describe('MockUsuario CRUD', () => {
    let mockUsuario: MockUsuario;

    beforeEach(() => {
        mockUsuario = new MockUsuario();
    });

    describe('findByEmail', () => {
        it('Debería encontrar un usuario por email', async () => {
            const usuario = await mockUsuario.findByEmail('admin@test.com');

            expect(usuario).toBeDefined();
            expect(usuario?.email).toBe('admin@test.com');
            expect(usuario?.nombre).toBe('Administrador');
            expect(usuario?.rol).toBe('admin');
        });

        it('Debería retornar undefined si el email no existe', async () => {
            const usuario = await mockUsuario.findByEmail('noexiste@test.com');

            expect(usuario).toBeUndefined();
        });

        it('Debería encontrar todos los usuarios mockeados', async () => {
            const admin = await mockUsuario.findByEmail('admin@test.com');
            const user = await mockUsuario.findByEmail('user@test.com');
            const test = await mockUsuario.findByEmail('test@test.com');

            expect(admin).toBeDefined();
            expect(user).toBeDefined();
            expect(test).toBeDefined();
        });
    });

    describe('findById', () => {
        it('Debería encontrar un usuario por ID', async () => {
            const usuario = await mockUsuario.findById(1);

            expect(usuario).toBeDefined();
            expect(usuario?.id).toBe(1);
            expect(usuario?.email).toBe('admin@test.com');
        });

        it('Debería retornar undefined si el ID no existe', async () => {
            const usuario = await mockUsuario.findById(999);

            expect(usuario).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('Debería retornar todos los usuarios', async () => {
            const usuarios = await mockUsuario.getAll();

            expect(usuarios).toBeInstanceOf(Array);
            expect(usuarios.length).toBeGreaterThanOrEqual(3);
        });

        it('Debería retornar usuarios sin contraseña (password vacío)', async () => {
            const usuarios = await mockUsuario.getAll();

            usuarios.forEach(usuario => {
                expect(usuario.password).toBe('');
            });
        });

        it('Debería retornar usuarios con todas las demás propiedades', async () => {
            const usuarios = await mockUsuario.getAll();

            usuarios.forEach(usuario => {
                expect(usuario.id).toBeDefined();
                expect(usuario.email).toBeDefined();
                expect(usuario.nombre).toBeDefined();
                expect(usuario.rol).toBeDefined();
            });
        });
    });

    describe('create', () => {
        it('Debería crear un nuevo usuario con contraseña hasheada', async () => {
            const nuevoUsuario = new Usuario(0, 'nuevo@test.com', 'password123', 'Nuevo Usuario');
            const usuarioCreado = await mockUsuario.create(nuevoUsuario);

            expect(usuarioCreado.id).toBeGreaterThan(0);
            expect(usuarioCreado.email).toBe('nuevo@test.com');
            expect(usuarioCreado.nombre).toBe('Nuevo Usuario');
            expect(usuarioCreado.rol).toBe('user');
        });

        it('Debería hashear la contraseña al crear un usuario', async () => {
            const passwordOriginal = 'password123';
            const nuevoUsuario = new Usuario(0, 'hash@test.com', passwordOriginal, 'Hash User');
            const usuarioCreado = await mockUsuario.create(nuevoUsuario);

            expect(usuarioCreado.password).not.toBe(passwordOriginal);
            expect(usuarioCreado.password.length).toBeGreaterThan(20);

            const esValido = bcrypt.compareSync(passwordOriginal, usuarioCreado.password);
            expect(esValido).toBe(true);
        });

        it('Debería asignar IDs incrementales automáticamente', async () => {
            const usuario1 = new Usuario(0, 'user1@test.com', 'pass1', 'User 1');
            const usuario2 = new Usuario(0, 'user2@test.com', 'pass2', 'User 2');

            const creado1 = await mockUsuario.create(usuario1);
            const creado2 = await mockUsuario.create(usuario2);

            expect(creado2.id).toBeGreaterThan(creado1.id);
        });

        it('Debería agregar el usuario al repositorio y poder encontrarlo', async () => {
            const nuevoUsuario = new Usuario(0, 'findme@test.com', 'password', 'Find Me');
            const usuarioCreado = await mockUsuario.create(nuevoUsuario);

            const usuarioEncontrado = await mockUsuario.findByEmail('findme@test.com');

            expect(usuarioEncontrado).toBeDefined();
            expect(usuarioEncontrado?.id).toBe(usuarioCreado.id);
            expect(usuarioEncontrado?.nombre).toBe('Find Me');
        });

        it('Debería crear usuario con rol user por defecto', async () => {
            const nuevoUsuario = new Usuario(0, 'default@test.com', 'pass', 'Default');
            const usuarioCreado = await mockUsuario.create(nuevoUsuario);

            expect(usuarioCreado.rol).toBe('user');
        });
    });

    describe('Contraseñas hasheadas en datos iniciales', () => {
        it('Las contraseñas de los usuarios iniciales deben estar hasheadas', async () => {
            const admin = await mockUsuario.findByEmail('admin@test.com');
            const user = await mockUsuario.findByEmail('user@test.com');

            expect(admin?.password).toBeDefined();
            expect(user?.password).toBeDefined();

            expect(admin?.password.length).toBeGreaterThan(50);
            expect(user?.password.length).toBeGreaterThan(50);
        });

        it('Debería poder verificar las contraseñas de los usuarios iniciales', async () => {
            const admin = await mockUsuario.findByEmail('admin@test.com');
            
            if (admin) {
                const esValida = bcrypt.compareSync('admin123', admin.password);
                expect(esValida).toBe(true);
            }
        });
    });
});
