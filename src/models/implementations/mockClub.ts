import { Club } from "../club";
import { ClubCrud } from "../interface/clubCrud";
import { Cancha } from "../cancha";

export class MockClub implements ClubCrud{
    protected tam: number;
    protected container: Array<Club>;
    protected id: number;
    constructor(){
        this.id=1;
        this.tam = 0;
        this.container = new Array<Club>;
    }

    getClubs(): Promise<Array<Club>> {
        return new Promise<Array<Club>>((resolve)=>{
            resolve(this.container);
        });
    }

    getClub(id: string): Promise<Club> {
        return new Promise<Club>((resolve, rejects)=>{
            const resultado = this.container.find((club: Club)=>{
                return club.getId() == id;
            });
            if (!resultado){
                rejects(new Error("No existe dicho id"));
            }else{
                resolve(resultado);
            }
        });
    }

    addClub(club: Club): Promise<Club> {
        return new Promise<Club>((resolve)=>{
            club.setId((this.id) + "");
            this.container.push(club);
            this.id++;
            this.tam++;
            resolve(club);
        });
    }

    deleteClub(id: string): Promise<void> {
        return new Promise<void>((resolve, rejects)=>{
            const index = this.container.findIndex((club: Club) => club.getId() === id);
            if (index === -1) {
                rejects(new Error("No existe un club con ese id"));
            }else{
                this.container.splice(index, 1);
                this.tam--;
            }
        });
    }

    editClub(id: string, direccion: string, nombreClub: string, telefono: string, gmail: string, valoracion: number): Promise<Club> {
        return new Promise<Club>((resolve, rejects)=>{
            const clubEncontrado = this.container.find(
                (club: Club)=> club.getId()==id
            );
            if (!clubEncontrado){
                rejects(new Error("Este turno no fue encontrada"));
            }else{
                clubEncontrado.setDireccion(direccion);
                clubEncontrado.setNombreClub(nombreClub);
                clubEncontrado.setTelefono(telefono);
                clubEncontrado.setGmail(gmail);
                clubEncontrado.setValoracion(valoracion);
                resolve(clubEncontrado);
            }
        });
    }

    addCanchaAClub(id: string, nuevaCancha: Cancha): Promise<Club> {
        return new Promise<Club>((resolve, rejects)=>{
            const clubEncontrado = this.container.find(
                (club: Club) => club.getId() == id
            );
            if (!clubEncontrado){
                rejects(new Error("Este turno no fue encontrado"))
            } else {
                clubEncontrado.anadirCancha(nuevaCancha);
                resolve(clubEncontrado);
            }
        });
    }

    deleteCanchaAClub(clubId: string, canchaId: string): Promise<Club> {
        return new Promise<Club>((resolve, rejects) => {
            const clubEncontrado = this.container.find(
                (club: Club) => club.getId() == clubId
            );
        
            if(!clubEncontrado){
                return rejects(new Error("El club no fue encontrado"));
            };
        
            const canchas = clubEncontrado.getCanchas();
            const index = canchas.findIndex((c: Cancha) => c.getId() === canchaId);
        
            if (index == -1){
                return rejects(new Error("La cancha no existente en este club"));
            }
        
            canchas.splice(index, 1);
            resolve(clubEncontrado)
        });
    }

    size(): number {
        return this.tam;
    }
    
}

export default new MockClub();