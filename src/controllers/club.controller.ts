import { Request, Response } from "express";
import clubService from "../services/club.service"
import { Club } from "../models/club";
import { Cancha } from "../models/cancha";
import canchaService from "../services/cancha.service";

class ClubController{
    public async getClubs(req: Request, res: Response){
        const clubs = await clubService.getClubs();
        res.status(200).json(clubs);
    }

    public async getClub(req: Request, res:Response){
        const id = req.params.id;
        if(!id){
            res.status(402).json({message: "Id no definido"});
        }else{
            try{
                const club = await clubService.getClub(id);
                res.status(200).json(club);
            }catch(error){
                if (error instanceof Error){
                    res.status(404).json({message: error.message});
                }
            }
        }
    }

    public async addClub(req: Request, res: Response){
        try{
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: "El cuerpo de la solicitud está vacío o no es válido" });
            }

            const { id, direccion, nombreClub, telefono, gmail, valoracion } = req.body;

            if(!id){
                return res.status(402).json({message:"Id no parametrizado"});
            } else if(direccion === undefined || nombreClub === undefined || telefono === undefined || gmail === undefined || valoracion === undefined){
                return res.status(402).json({message:"Parametros incorrectos"});
            }
            
            try {
                await clubService.getClub(id); 
                return res.status(409).json({ message: `Ya existe un club con el ID ${id}.` });
            } catch (error) {
                // Si falla (ej. 404), el ID es nuevo. Continuamos.
            }

            // Si esta todo bien, creamos el club
            const clubCreado = new Club(id, direccion, nombreClub, telefono, gmail, valoracion);
            const nuevoClub = await clubService.addClub(clubCreado);
            res.status(201).json(nuevoClub);
            
        }catch(error){
            // Si hay un error extra
            res.status(500).json({ message: "Error al agregar club", error});
        }   
    }

    public deleteClub(req: Request, res: Response){
        const id = req.params.id;
        if(!id){
            res.status(402).json({message: "Id no definido"});
        }else{
            try{
                clubService.deleteClub(id);
                res.status(200).json({message: "Club eliminado"});
            }catch(error){
                if (error instanceof Error){
                    res.status(404).json({message: error});
                }
            }
        }
    }

    public async editClub(req: Request, res: Response){
        const id = req.params.id;
        const {direccion, nombreClub, telefono, gmail, valoracion} = req.body

        if(!id){
            return res.status(402).json({message: "Id no definido"});
        }

        if(direccion === undefined || nombreClub === undefined || telefono === undefined || gmail === undefined || valoracion === undefined){
            return res.status(402).json({message: "Parametro de Club incorrectos"});
        }
        
        try{
            await clubService.getClub(id);

            const clubModificado = await clubService.editClub(id, direccion, nombreClub, telefono, gmail, valoracion);
            res.status(200).json(clubModificado);
        }catch(error){
            if(error instanceof Error){
                res.status(404).json({message:error.message});
            }else{
                res.status(500).json({message: "Error al modificar el club"});
            }
        } 
    }

    public async addCanchaAClub(req: Request, res: Response){
        const idClub = req.params.idClub; // ID del Turno a agregar horario
        const idCancha = req.params.idCancha; //ID del Horario a agregar horario
        const { nombreCancha, deporte, tamanio, turno } = req.body;
            
        if(!idClub || !idCancha){
            return res.status(402).json({message: "Id del Club/Cancha no definido"});
        }
            
        if(nombreCancha === undefined || deporte === undefined || turno === undefined || tamanio === undefined || nombreCancha === "" || deporte === "" || turno === "" || tamanio === ""){
            return res.status(402).json({message: "Datos de la cancha incompletos o vacios"});
        }
        
        try{
            const clubEncontrado = await clubService.getClub(idClub);

            if(clubEncontrado.getCanchas && clubEncontrado.getCanchas().some((cancha: Cancha) => cancha.getId() === idCancha)){
                return res.status(409).json({ message: `La cancha con ID ${idCancha} ya esta asociada al club ${idClub}.` });
            }
            
            const nuevaCancha = new Cancha(idCancha,  nombreCancha, deporte, tamanio, turno);
            
            const clubModificado = await clubService.addCanchaAClub(idClub, nuevaCancha);
            res.status(200).json(clubModificado);
        }catch(error){
            if(error instanceof Error){
                res.status(404).json({message: error.message});
            }else{ 
                res.status(500).json({message: "Error al añadir cancha"});
            }
        } 
    }
    
    public async deleteCanchaAClub(req: Request, res: Response){
        const idClub = req.params.idClub;
        const idCancha = req.params.idCancha;
    
        if(!idClub){
            return res.status(402).json({message: "Id del Club no definido"});
        }
    
        if(!idCancha){
            return res.status(402).json({message: "Id de la Cancha no definido"});
        }
    
        try {
            await clubService.getClub(idClub);
            const clubModificado = await clubService.deleteCanchaAClub(idClub, idCancha);
            res.status(200).json(clubModificado);
        }catch(error){
            if (error instanceof Error){
                res.status(404).json({message:error.message});
            }else{
                res.status(500).json({message: "Error al eliminar la cancha del club"});
            }
        }
    }
    
    public size(req:Request, res:Response){
        res.status(200).json({size: clubService.size()})
    }
}
export default new ClubController();