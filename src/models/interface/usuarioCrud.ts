import { Usuario } from "../usuario";

export interface UsuarioCrud {
    findByEmail(email: string): Usuario | undefined;
    findById(id: number): Usuario | undefined;
    getAll(): Usuario[];
    create(usuario: Usuario): Usuario;
}
