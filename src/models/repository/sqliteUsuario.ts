import { Usuario } from "../usuario";
import { UsuarioCrud } from "../interface/usuarioCrud";
import { openDb } from "../../database/database";
import bcrypt from 'bcryptjs';

export class SQLiteUsuario implements UsuarioCrud {
    
    async findByEmail(email: string): Promise<Usuario | undefined> {
        const db = await openDb();
        const row = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (!row) {
            return undefined;
        }

        return new Usuario(row.id, row.email, row.password, row.nombre, row.rol);
    }

    async findById(id: number): Promise<Usuario | undefined> {
        const db = await openDb();
        const row = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
        
        if (!row) {
            return undefined;
        }

        return new Usuario(row.id, row.email, row.password, row.nombre, row.rol);
    }

    async getAll(): Promise<Usuario[]> {
        const db = await openDb();
        const rows = await db.all('SELECT * FROM usuarios');
        
        return rows.map(row => new Usuario(row.id, row.email, row.password, row.nombre, row.rol));
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const db = await openDb();
        
        // Hash de la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(usuario.password, 10);
        
        const result = await db.run(
            'INSERT INTO usuarios (email, password, nombre, rol) VALUES (?, ?, ?, ?)',
            [usuario.email, hashedPassword, usuario.nombre, usuario.rol]
        );
        
        usuario.id = result.lastID || 0;
        usuario.password = hashedPassword;
        
        return usuario;
    }
}

export default new SQLiteUsuario();
