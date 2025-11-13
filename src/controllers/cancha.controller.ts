import { Request, Response } from "express";
import canchaService from "../services/cancha.service";
import { Cancha } from "../models/cancha";

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
            const { id, nombreCancha, deporte, tamanio, turno } = req.body;
            if(!id){
                res.status(402).json({message:"Id no parametrizado"});
            }else{
                if (nombreCancha === undefined || deporte === undefined || tamanio  === undefined || turno  === undefined){ 
                        res.status(402).json({message:"nombre, deporte, tamanio o turno no parametrizado"});
                } else {
                    const canchaCreada = new Cancha(id, nombreCancha, deporte, tamanio, turno);
                    const nuevaCancha = await canchaService.addCancha(canchaCreada);
                    res.status(202).json(nuevaCancha);
            }
        }    
        }catch(error){
            res.status(500).json({ message: "Error al agregar cancha", error});
        }    
    }

    public deleteCancha(req: Request, res: Response){
        const id = req.params.id;
        if(!id){
            res.status(402).json({message: "Id no definido"});
        }else{
            try{
                canchaService.deleteCancha(id);
                res.status(200).json({message: "Cancha eliminada"});
            }catch(error){
                if (error instanceof Error){
                    res.status(404).json({message: error});
                }
            }
        }
    }

    public async editCancha(req: Request, res: Response){
        const id = req.params.id;
        const {nombreCancha, deporte, tamanio, turno } = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(!nombreCancha || !deporte || !tamanio || !turno){
                res.status(402).json(
                {message: "Cancha incorrecta"}
            );
            }
        }else{
            try{
                const canchaModificado = await canchaService.editCancha(id, nombreCancha, deporte, tamanio, turno );
                res.status(200).json(canchaModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public size(req:Request, res:Response){
        res.status(200).json({size: canchaService.size()})
    }
}

export default new CanchaController();