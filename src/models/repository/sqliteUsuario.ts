import { Usuario } from "../usuario";
import { UsuarioCrud } from "../interface/usuarioCrud";
import { openDb } from "../../database/database";
import bcrypt from 'bcryptjs';

export class SQLiteUsuario implements UsuarioCrud {
    
    async findByEmail(email: string): Promise<Usuario | undefined> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT * FROM usuarios WHERE email = ?',
            args: [email]
        });
        
        if (result.rows.length === 0) {
            return undefined;
        }

        const row = result.rows[0];
        return new Usuario(row.id as number, row.email as string, row.password as string, row.nombre as string, row.rol as string);
    }

    async findById(id: number): Promise<Usuario | undefined> {
        const db = await openDb();
        const result = await db.execute({
            sql: 'SELECT * FROM usuarios WHERE id = ?',
            args: [id]
        });
        
        if (result.rows.length === 0) {
            return undefined;
        }

        const row = result.rows[0];
        return new Usuario(row.id as number, row.email as string, row.password as string, row.nombre as string, row.rol as string);
    }

    async getAll(): Promise<Usuario[]> {
        const db = await openDb();
        const result = await db.execute('SELECT * FROM usuarios');
        
        return result.rows.map((row: any) => new Usuario(row.id, row.email, row.password, row.nombre, row.rol));
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const db = await openDb();
        
        // Hash de la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(usuario.password, 10);
        
        const result = await db.execute({
            sql: 'INSERT INTO usuarios (email, password, nombre, rol) VALUES (?, ?, ?, ?)',
            args: [usuario.email, hashedPassword, usuario.nombre, usuario.rol]
        });
        
        usuario.id = Number(result.lastInsertRowid) || 0;
        usuario.password = hashedPassword;
        
        return usuario;
    }
}

export default new SQLiteUsuario();
