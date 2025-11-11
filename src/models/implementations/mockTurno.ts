import { Turno } from "../turno";
import { TurnoCrud } from "../interface/turnoCrud";
import { Horario } from "../horario";

export class MockTurno implements TurnoCrud{
    protected tam: number;
    protected container: Array<Turno>;
    protected id: number;
    constructor(){
        this.id=1;
        this.tam = 0;
        this.container = new Array<Turno>;
    }

    getTurnos(): Promise<Array<Turno>> {
        return new Promise<Array<Turno>>((resolve)=>{
            resolve(this.container);
        });
    }

    getTurno(id:string): Promise<Turno> {
            return new Promise<Turno>((resolve, rejects)=>{
                const resultado = this.container.find((turno: Turno)=>{
                return turno.getId() == id;
                });
                if (!resultado){
                    rejects(new Error("No existe dicho id"));
                }else{
                    resolve(resultado);
                }
            });
        }

    addTurno(turno: Turno): Promise<Turno> {
        return new Promise<Turno>((resolve)=>{
            turno.setId((this.id) + "");
            this.container.push(turno);
            this.id++;
            this.tam++;
            resolve(turno);
        });
    }

    deleteTurno(id: string): Promise<void> {
        return new Promise<void>((resolve, rejects)=>{
            const index = this.container.findIndex((turno: Turno) => turno.getId() === id);
            if (index === -1) {
                rejects(new Error("No existe un turno con ese id"));
            }else{
                this.container.splice(index, 1);
                this.tam--;
            }
        });
    }

    editTurno(id:string, disponibilidad:boolean, costo: number, horarios: Horario[]): Promise<Turno> {
        return new Promise<Turno>((resolve, rejects)=>{
            const turnoEncontrado = this.container.find(
                (turno:Turno)=> turno.getId()==id
            );
            if (!turnoEncontrado){
                rejects(new Error("Este turno no fue encontrada"));
            }else{
                turnoEncontrado.setDisponibilidad(disponibilidad);
                turnoEncontrado.setCosto(costo);
                turnoEncontrado.setHorarios(horarios);
                resolve(turnoEncontrado);
            }
        });
    }

    confirmarTurno(id: string, disponibilidad: boolean): Promise<Turno> {
        return new Promise<Turno>((resolve, rejects)=>{
            const turnoEncontrado = this.container.find(
                (turno:Turno)=> turno.getId()==id
            );
            if (!turnoEncontrado){
                rejects(new Error("Este turno no fue encontrado"));
            }else{
                turnoEncontrado.setDisponibilidad(disponibilidad);
                resolve(turnoEncontrado);
            }
        });
    }

    size(): number {
        return this.tam;
    }
    
}

export default new MockTurno();