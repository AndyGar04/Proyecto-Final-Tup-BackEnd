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
    size(): number {
        return this.tam;
    }
    
}

export default new MockHorario();