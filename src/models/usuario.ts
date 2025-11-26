export class Usuario {
    id: number;
    email: string;
    password: string;
    nombre: string;
    rol: string;

    constructor(id: number, email: string, password: string, nombre: string, rol: string = 'user') {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.rol = rol;
    }
}
