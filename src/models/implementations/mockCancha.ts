import { Cancha } from "../cancha";
import { CanchaCrud } from "../interface/canchaCrud";
import { Turno } from "../turno";

export class MockCancha implements CanchaCrud {
    protected tam: number;
    protected container: Array<Cancha>;
    protected id: number;
    constructor(){
        this.id=1;
        this.tam = 0;
        this.container = new Array<Cancha>;
    }

    getCanchas(): Promise<Array<Cancha>> {
        return new Promise<Array<Cancha>>((resolve)=>{
            resolve(this.container);
        });
    }

    getCancha(id: string): Promise<Cancha> {
        return new Promise<Cancha>((resolve, rejects)=>{
                const resultado = this.container.find((cancha: Cancha)=>{
                return cancha.getId() == id;
                });
                if (!resultado){
                    rejects(new Error("No existe dicho id"));
                }else{
                    resolve(resultado);
                }
        });
    }

    addCancha(cancha: Cancha): Promise<Cancha> {
        return new Promise<Cancha>((resolve)=>{
            cancha.setId((this.id) + "");
            this.container.push(cancha);
            this.id++;
            this.tam++;
            resolve(cancha);
        });
    }

    deleteCancha(id: string): Promise<void> {
        return new Promise<void>((resolve, rejects)=>{
            const index = this.container.findIndex((cancha: Cancha) => cancha.getId() === id);
            if (index === -1) {
                rejects(new Error("No existe una cancha con ese id"));
            }else{
                this.container.splice(index, 1);
                this.tam--;
            }
        });
    }

    editCancha(id: string, nombreCancha: string, deporte: string, tamanio: string, turno: Turno): Promise<Cancha> {
        return new Promise<Cancha>((resolve, rejects)=>{
            const canchaEncontrada = this.container.find(
                (cancha:Cancha)=> cancha.getId()==id
            );
            if (!canchaEncontrada){
                rejects(new Error("Este turno no fue encontrada"));
            }else{
                canchaEncontrada.setNombreCancha(nombreCancha);
                canchaEncontrada.setDeporte(deporte);
                canchaEncontrada.setTamanio(tamanio);
                canchaEncontrada.setTurno(turno);
                resolve(canchaEncontrada);
            }
        });
    }
    
    size(): number {
        return this.tam;
    }

}

export default new MockCancha();