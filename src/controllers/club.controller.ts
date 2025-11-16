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
                res.status(402).json({message:"Id no parametrizado"});
            }else if(direccion === undefined || nombreClub === undefined || telefono === undefined || gmail === undefined || valoracion === undefined){
                res.status(402).json({message:"Parametros incorrectos"});
            }else{
                const clubCreado = new Club(id, direccion, nombreClub, telefono, gmail, valoracion);
                const nuevoClub = await clubService.addClub(clubCreado);
                res.status(201).json(nuevoClub);
            }
        }catch(error){
            res.status(500).json({ message: "Error al agregar turno", error});
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
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(direccion === undefined || nombreClub === undefined || telefono === undefined || gmail === undefined || valoracion === undefined){
                res.status(402).json(
                {message: "Club incorrecto"}
            );
            }
        }else{
            try{
                const clubModificado = await clubService.editClub(id, direccion, nombreClub, telefono, gmail, valoracion);
                res.status(200).json(clubModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public async addCanchaAClub(req: Request, res: Response){
        const idClub = req.params.idClub; // ID del Turno a agregar horario
        const idCancha = req.params.idCancha; //ID del Horario a agregar horario
        const { nombreCancha, deporte, tamanio, turno } = req.body;
            
        if(!idClub || !idCancha){
            return res.status(402).json({message: "Id del Turno/Horario no definido"});
        }
            
        if(nombreCancha === undefined || deporte === undefined || turno === undefined || tamanio === undefined){
            return res.status(402).json({message: "Datos de la cancha incompletos"});
        }
    
        if (nombreCancha === "" || deporte === "" || turno === "" || tamanio === "") {
            return res.status(402).json({message: "Los campos no pueden estar vacíos"});
        }
            
        try{
            const nuevaCancha = new Cancha(idCancha,  nombreCancha, deporte, tamanio, turno);
            const canchaModificada = await clubService.addCanchaAClub(idClub, nuevaCancha);
            res.status(200).json(canchaModificada);
        }catch(error){
            if(error instanceof Error)
                res.status(404).json({message: error.message});
            else 
                res.status(500).json({message: "Error al añadir cancha"});
            } 
    }
    
    public async deleteCanchaAClub(req: Request, res: Response){
        const clubId = req.params.clubId;
        const canchaId = req.params.canchaId;
    
        if(!clubId){
            return res.status(402).json({message: "Id del Turno no definido"});
        }
    
        if(!canchaId){
            return res.status(402).json({message: "Id del Horario no definido"});
        }
    
        try {
            const clubModificado = await clubService.deleteCanchaAClub(clubId, canchaId);
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