import { describe, it, expect, beforeEach } from 'vitest';
import { Usuario } from '../../models/usuario';

describe('Usuario Model', () => {
    it('Debería crear una instancia de Usuario correctamente con rol por defecto', () => {
        const usuario = new Usuario(1, 'test@test.com', 'password123', 'Test User');

        expect(usuario).toBeInstanceOf(Usuario);
        expect(usuario.id).toBe(1);
        expect(usuario.email).toBe('test@test.com');
        expect(usuario.password).toBe('password123');
        expect(usuario.nombre).toBe('Test User');
        expect(usuario.rol).toBe('user');
    });

    it('Debería crear una instancia de Usuario con rol admin', () => {
        const usuario = new Usuario(2, 'admin@test.com', 'admin123', 'Administrador', 'admin');

        expect(usuario).toBeInstanceOf(Usuario);
        expect(usuario.id).toBe(2);
        expect(usuario.email).toBe('admin@test.com');
        expect(usuario.nombre).toBe('Administrador');
        expect(usuario.rol).toBe('admin');
    });

    it('Debería permitir modificar las propiedades del usuario', () => {
        const usuario = new Usuario(3, 'user@test.com', 'pass123', 'Usuario');

        usuario.nombre = 'Nuevo Nombre';
        usuario.email = 'nuevo@test.com';
        usuario.rol = 'admin';

        expect(usuario.nombre).toBe('Nuevo Nombre');
        expect(usuario.email).toBe('nuevo@test.com');
        expect(usuario.rol).toBe('admin');
    });

    it('Debería almacenar correctamente la contraseña', () => {
        const password = 'superSecretPassword123';
        const usuario = new Usuario(4, 'secure@test.com', password, 'Secure User');

        expect(usuario.password).toBe(password);
    });

    it('Debería crear múltiples usuarios con diferentes IDs', () => {
        const usuario1 = new Usuario(1, 'user1@test.com', 'pass1', 'User One');
        const usuario2 = new Usuario(2, 'user2@test.com', 'pass2', 'User Two');

        expect(usuario1.id).not.toBe(usuario2.id);
        expect(usuario1.email).not.toBe(usuario2.email);
    });
});
