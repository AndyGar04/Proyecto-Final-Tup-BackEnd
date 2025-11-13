export class Horario{
    constructor (
        protected id: string,
        protected disponibilidad: boolean,
        protected horario: string
    ){}

    //Getter y Setter de ID
    public getId(): string{
        return this.id
    }
    public setId(id: string): void{
        this.id = id
    }

    // Getter y Setter de disponibilidad
    public getDisponibilidad(): boolean {
        return this.disponibilidad;
    }
    public setDisponibilidad(disponibilidad: boolean): void {
        this.disponibilidad = disponibilidad;
    }
    
    // Getter y Setter de horario
    public getHorario(): string {
        return this.horario;
    }
    public setHorario(horario: string): void {
        this.horario = horario;
    }
}