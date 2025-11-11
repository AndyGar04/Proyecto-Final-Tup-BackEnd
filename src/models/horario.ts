export class Horario{
    constructor (
        protected descripcionTurno: string,
        protected horario: string,
        protected id: string
    ){}

    //Getter y Setter de ID
    public getId(): string{
        return this.id
    }
    public setId(id: string): void{
        this.id = id
    }

    // Getter y Setter de descripcionTurno
    public getDescTurno(): string {
        return this.descripcionTurno;
    }
    public setDescTurno(descripcionTurno: string): void {
        this.descripcionTurno = descripcionTurno;
    }
    
    // Getter y Setter de horario
    public getHorario(): string {
        return this.horario;
    }
    public setHorario(horario: string): void {
        this.horario = horario;
    }
}