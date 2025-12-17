import { Horario } from "../horario";
import { HorarioCrud } from "../interface/horarioCrud";

export class MockHorario implements HorarioCrud{
    protected tam: number;
    protected container: Array<Horario>;
    protected id: number;
    constructor(){
        this.id=1;
        this.tam = 0;
        this.container = new Array<Horario>;
        this.container = [
        new Horario("1", true, "10:00", new Date("2024-12-01")),
        new Horario("2", true, "12:00", new Date("2024-12-01")),
        new Horario("3", false, "14:00", new Date("2024-12-01")),
        new Horario("4", true, "16:00", new Date("2024-12-02")),
        new Horario("5", true, "18:00", new Date("2024-12-02")),
        ];
        this.tam = 5;
        this.id = 6;
    }

    getHorarios(): Promise<Array<Horario>> {
        return new Promise<Array<Horario>>((resolve)=>{
            resolve(this.container);
        });
    }

    addHorario(horario: Horario): Promise<Horario> {
        return new Promise<Horario>((resolve)=>{
            horario.setId((this.id) + "");
            this.container.push(horario);
            this.id++;
            this.tam++;
            resolve(horario);
        });
    }

    addHorarios(horarios: Horario[]): Promise<void> {
        return new Promise<void>((resolve) => {
            horarios.forEach((horario) => {
                horario.setId((this.id) + "");
                this.container.push(horario);
                this.id++;
                this.tam++;
            });
            resolve();
        });
    }

    deleteHorario(id: string): Promise<void> {
        return new Promise<void>((resolve, rejects)=>{
            const index = this.container.findIndex((horario: Horario) => horario.getId() === id);
            if (index === -1) {
                rejects(new Error("No existe una Horario con ese id"));
            }else{
                this.container.splice(index, 1);
                this.tam--;
            }
        });
    }

    editHorario(id:string, disponibilidad:boolean, horario: string, diaHorario: Date): Promise<Horario> {
        return new Promise<Horario>((resolve, rejects)=>{
            const horarioEncontrado = this.container.find(
                (horario:Horario)=> horario.getId()==id
            );
            if (!horarioEncontrado){
                rejects(new Error("Esta categoria no fue encontrada"));
            }else{
                horarioEncontrado.setDisponibilidad(disponibilidad);
                horarioEncontrado.setHorario(horario);
                horarioEncontrado.setDiaHorario(diaHorario);
                resolve(horarioEncontrado);
            }
        });
    }
    size(): Promise<number> {
        return new Promise<number>((resolve) => {
            resolve(this.tam);
        });
    }
    
}

export default new MockHorario();