import { Request, Response } from "express";
import canchaService from "../services/cancha.service";
import { Cancha } from "../models/cancha";
import turnoService from "../services/turno.service";

class CanchaController { 
    public async getCanchas (req: Request, res: Response){
        const canchas = await canchaService.getCanchas();
        res.status(200).json(canchas); 
    }

    public async getCancha(req: Request, res:Response){
            const id = req.params.id;
            if(!id){
                res.status(402).json({message: "Id no definido"});
            }else{
                try{
                    const turno = await canchaService.getCancha(id);
                    res.status(200).json(turno);
                }catch(error){
                    if (error instanceof Error){
                        res.status(404).json({
                            message: error.message
                        })
                    }
                }
            }
        }

    public async addCancha(req: Request, res: Response){
        try{
            const { nombreCancha, deporte, tamanio, idTurno } = req.body;

            if (nombreCancha === undefined || deporte === undefined || tamanio === undefined || idTurno === undefined || !nombreCancha || !deporte || !tamanio){ 
                return res.status(400).json({message:"Nombre de la cancha, Deporte, Tamanio o idTurno no parametrizado"});
            }
            
            let turnoExistente;
            try {
                turnoExistente = await turnoService.getTurno(idTurno);
            } catch (error) {
                return res.status(404).json({ message: `Turno con ID ${idTurno} no encontrado. No se puede crear la cancha.` });
            }

            const canchaCreada = new Cancha("0", nombreCancha, deporte, tamanio, turnoExistente);
            const nuevaCancha = await canchaService.addCancha(canchaCreada);
            res.status(201).json(nuevaCancha);

        }catch(error){
            res.status(500).json({ message: "Error al agregar cancha", error: String(error)});
        }    
    }

    public async deleteCancha(req: Request, res: Response){
        const id = req.params.id;
        if(!id){
            return res.status(402).json({message: "Id no definido"});
        }    
        try{
            await canchaService.deleteCancha(id);
            res.status(200).json({message: "Cancha eliminada"});
        }catch(error){
            if (error instanceof Error){
                res.status(404).json({message: error});
            }
        }
    }

    public async editCancha(req: Request, res: Response){
        const id = req.params.id;
        const {nombreCancha, deporte, tamanio, idTurno} = req.body;

        if(!id){
            return res.status(402).json({message: "Id no definido"});
        }

        if (nombreCancha === undefined || deporte === undefined || tamanio === undefined || idTurno === undefined || !nombreCancha || !deporte || !tamanio){
            return res.status(402).json({message: "Parametros de cancha incompletos"});
        }

        try{
            await canchaService.getCancha(id);

            const turnoNuevo = await turnoService.getTurno(idTurno);

            const canchaModificada = await canchaService.editCancha(id, nombreCancha, deporte, tamanio, turnoNuevo);
            res.status(200).json(canchaModificada);
        }catch(error){
            if(error instanceof Error){
                res.status(404).json({message:error.message});
            }else{
                res.status(500).json({ message: "Error interno al modificar cancha"});
            }
        } 
    }

    public async size(req:Request, res:Response){
        const total = await canchaService.size();
        res.status(200).json({size: total});
    }
}

export default new CanchaController();