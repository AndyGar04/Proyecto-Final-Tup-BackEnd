import { Usuario } from "../usuario";

export interface UsuarioCrud {
    findByEmail(email: string): Promise<Usuario | undefined>;
    findById(id: number): Promise<Usuario | undefined>;
    getAll(): Promise<Usuario[]>;
    create(usuario: Usuario): Promise<Usuario>;
}
