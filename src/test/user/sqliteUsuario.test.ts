import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SQLiteUsuario } from '../../models/repository/sqliteUsuario';
import { Usuario } from '../../models/usuario';
import { openDb } from '../../database/database';
import bcrypt from 'bcryptjs';

describe('SQLiteUsuario - Integración con Base de Datos', () => {
    let sqliteUsuario: SQLiteUsuario;

    beforeEach(async () => {
        sqliteUsuario = new SQLiteUsuario();
        
        // Limpiar la tabla de usuarios antes de cada test
        const db = await openDb();
        await db.run('DELETE FROM usuarios');
        
        // Insertar usuarios de prueba
        await db.run(
            'INSERT INTO usuarios (email, password, nombre, rol) VALUES (?, ?, ?, ?)',
            ['admin@test.com', bcrypt.hashSync('admin123', 4), 'Administrador', 'admin']
        );
        await db.run(
            'INSERT INTO usuarios (email, password, nombre, rol) VALUES (?, ?, ?, ?)',
            ['user@test.com', bcrypt.hashSync('user123', 4), 'Usuario Prueba', 'user']
        );
    });

    afterEach(async () => {
        // Limpiar después de cada test
        const db = await openDb();
        await db.run('DELETE FROM usuarios');
    });

    describe('findByEmail', () => {
        it('Debería encontrar un usuario existente por email', async () => {
            const usuario = await sqliteUsuario.findByEmail('admin@test.com');

            expect(usuario).toBeDefined();
            expect(usuario?.email).toBe('admin@test.com');
            expect(usuario?.nombre).toBe('Administrador');
            expect(usuario?.rol).toBe('admin');
        });

        it('Debería retornar undefined si el email no existe', async () => {
            const usuario = await sqliteUsuario.findByEmail('noexiste@test.com');

            expect(usuario).toBeUndefined();
        });

        it('Debería retornar el usuario con contraseña hasheada', async () => {
            const usuario = await sqliteUsuario.findByEmail('admin@test.com');

            expect(usuario).toBeDefined();
            expect(usuario?.password).toBeDefined();
            expect(usuario?.password.length).toBeGreaterThan(20);
            
            // Verificar que la contraseña hasheada es válida
            if (usuario) {
                const esValida = bcrypt.compareSync('admin123', usuario.password);
                expect(esValida).toBe(true);
            }
        });
    });

    describe('findById', () => {
        it('Debería encontrar un usuario existente por ID', async () => {
            // Primero obtener el ID de un usuario existente
            const adminEmail = await sqliteUsuario.findByEmail('admin@test.com');
            expect(adminEmail).toBeDefined();
            
            const usuario = await sqliteUsuario.findById(adminEmail!.id);

            expect(usuario).toBeDefined();
            expect(usuario?.email).toBe('admin@test.com');
            expect(usuario?.nombre).toBe('Administrador');
        });

        it('Debería retornar undefined si el ID no existe', async () => {
            const usuario = await sqliteUsuario.findById(99999);

            expect(usuario).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('Debería retornar todos los usuarios', async () => {
            const usuarios = await sqliteUsuario.getAll();

            expect(usuarios).toBeInstanceOf(Array);
            expect(usuarios.length).toBe(2);
        });

        it('Debería retornar usuarios con todas las propiedades', async () => {
            const usuarios = await sqliteUsuario.getAll();

            usuarios.forEach(usuario => {
                expect(usuario.id).toBeDefined();
                expect(usuario.email).toBeDefined();
                expect(usuario.nombre).toBeDefined();
                expect(usuario.rol).toBeDefined();
                expect(usuario.password).toBeDefined();
            });
        });

        it('Debería retornar array vacío si no hay usuarios', async () => {
            // Limpiar todos los usuarios
            const db = await openDb();
            await db.run('DELETE FROM usuarios');

            const usuarios = await sqliteUsuario.getAll();

            expect(usuarios).toBeInstanceOf(Array);
            expect(usuarios.length).toBe(0);
        });
    });

    describe('create', () => {
        it('Debería crear un nuevo usuario con contraseña hasheada', async () => {
            const nuevoUsuario = new Usuario(0, 'nuevo@test.com', 'password123', 'Nuevo Usuario', 'user');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            expect(usuarioCreado.id).toBeGreaterThan(0);
            expect(usuarioCreado.email).toBe('nuevo@test.com');
            expect(usuarioCreado.nombre).toBe('Nuevo Usuario');
            expect(usuarioCreado.rol).toBe('user');
            expect(usuarioCreado.password).not.toBe('password123');
        });

        it('Debería hashear la contraseña al crear un usuario', async () => {
            const passwordOriginal = 'password123';
            const nuevoUsuario = new Usuario(0, 'hash@test.com', passwordOriginal, 'Hash User', 'user');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            expect(usuarioCreado.password).not.toBe(passwordOriginal);
            expect(usuarioCreado.password.length).toBeGreaterThan(50);

            const esValido = await bcrypt.compare(passwordOriginal, usuarioCreado.password);
            expect(esValido).toBe(true);
        });

        it('Debería poder encontrar el usuario creado después de insertarlo', async () => {
            const nuevoUsuario = new Usuario(0, 'findme@test.com', 'password', 'Find Me', 'user');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            const usuarioEncontrado = await sqliteUsuario.findByEmail('findme@test.com');

            expect(usuarioEncontrado).toBeDefined();
            expect(usuarioEncontrado?.id).toBe(usuarioCreado.id);
            expect(usuarioEncontrado?.nombre).toBe('Find Me');
        });

        it('Debería crear usuario con rol user por defecto', async () => {
            const nuevoUsuario = new Usuario(0, 'default@test.com', 'pass', 'Default');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            expect(usuarioCreado.rol).toBe('user');
        });

        it('Debería crear usuario con rol admin si se especifica', async () => {
            const nuevoUsuario = new Usuario(0, 'newadmin@test.com', 'pass', 'New Admin', 'admin');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            expect(usuarioCreado.rol).toBe('admin');
        });
    });

    describe('Integridad de datos', () => {
        it('Debería mantener los IDs únicos e incrementales', async () => {
            const usuario1 = new Usuario(0, 'user1@test.com', 'pass1', 'User 1');
            const usuario2 = new Usuario(0, 'user2@test.com', 'pass2', 'User 2');

            const creado1 = await sqliteUsuario.create(usuario1);
            const creado2 = await sqliteUsuario.create(usuario2);

            expect(creado2.id).toBeGreaterThan(creado1.id);
        });

        it('No debería permitir emails duplicados', async () => {
            const usuario1 = new Usuario(0, 'duplicado@test.com', 'pass1', 'Usuario 1');
            await sqliteUsuario.create(usuario1);

            const usuario2 = new Usuario(0, 'duplicado@test.com', 'pass2', 'Usuario 2');
            
            // Debería fallar por email duplicado
            await expect(sqliteUsuario.create(usuario2)).rejects.toThrow();
        });

        it('Debería persistir los datos entre consultas', async () => {
            const nuevoUsuario = new Usuario(0, 'persist@test.com', 'password', 'Persist User');
            const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

            // Crear una nueva instancia del repositorio para simular reconexión
            const nuevoRepositorio = new SQLiteUsuario();
            const usuarioRecuperado = await nuevoRepositorio.findById(usuarioCreado.id);

            expect(usuarioRecuperado).toBeDefined();
            expect(usuarioRecuperado?.email).toBe('persist@test.com');
            expect(usuarioRecuperado?.nombre).toBe('Persist User');
        });
    });

    describe('Validación de contraseñas', () => {
        it('Las contraseñas guardadas deben ser verificables con bcrypt', async () => {
            const passwords = ['admin123', 'user123', 'test456'];
            
            for (const pass of passwords) {
                const nuevoUsuario = new Usuario(0, `test-${pass}@test.com`, pass, 'Test User');
                const usuarioCreado = await sqliteUsuario.create(nuevoUsuario);

                const esValida = await bcrypt.compare(pass, usuarioCreado.password);
                expect(esValida).toBe(true);
            }
        });

        it('Contraseñas incorrectas no deben validar', async () => {
            const usuario = await sqliteUsuario.findByEmail('admin@test.com');
            expect(usuario).toBeDefined();

            if (usuario) {
                const esValida = await bcrypt.compare('contraseña_incorrecta', usuario.password);
                expect(esValida).toBe(false);
            }
        });
    });
});
