import { initDb } from '../database/database';
import sqliteUsuario from '../models/repository/sqliteUsuario';
import { Usuario } from '../models/usuario';

async function initializeAdmin() {
    try {
        // Inicializar la base de datos
        await initDb();
        console.log('Base de datos inicializada');

        // Verificar si ya existe un administrador
        const adminExists = await sqliteUsuario.findByEmail('admin@test.com');
        
        if (adminExists) {
            console.log('El usuario administrador ya existe');
            return;
        }

        // Crear usuario administrador
        const admin = new Usuario(0, 'admin@test.com', 'admin123', 'Administrador', 'admin');
        await sqliteUsuario.create(admin);
        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');

        // Crear usuario de prueba
        const userExists = await sqliteUsuario.findByEmail('user@test.com');
        if (!userExists) {
            const user = new Usuario(0, 'user@test.com', 'user123', 'Usuario Prueba', 'user');
            await sqliteUsuario.create(user);
            console.log('Usuario de prueba creado exitosamente');
            console.log('Email: user@test.com');
            console.log('Password: user123');
        }

    } catch (error) {
        console.error('Error al inicializar:', error);
    }
}

initializeAdmin();
