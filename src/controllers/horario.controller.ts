import { Request, Response } from "express";
import horarioService from "../services/horario.service";
import { Horario } from "../models/horario";

class HorarioController { 
    public async getHorarios (req: Request, res: Response){
        const horarios = await horarioService.getHorarios();
        res.status(200).json(horarios); 
    }

    public async addHorario(req: Request, res: Response){
        try{
            const { id, disponibilidad, horario } = req.body;
                if(!id){
                    res.status(402).json({message:"Id no parametrizado"});
                }else{
                    if (disponibilidad === undefined || horario === undefined){ 
                        res.status(402).json({message:"Disponibilidad u horario no parametrizado"});
                    } else {
                        const horarioCreado = new Horario(id, disponibilidad, horario);
                        const nuevoHorario = await horarioService.addHorario(horarioCreado);
                        res.status(202).json(nuevoHorario);
                    }
            }    
        }catch(error){
            res.status(500).json({ message: "Error al agregar horario", error});
        }    
    }

    public deleteHorario(req: Request, res: Response){
        const id = req.params.id;
        if(!id){
            res.status(402).json({message: "Id no definido"});
        }else{
            try{
                horarioService.deleteHorario(id);
                res.status(200).json({message: "Horario eliminada"});
            }catch(error){
                if (error instanceof Error){
                    res.status(404).json({message: error});
                }
            }
        }
    }

    public async editHorario(req: Request, res: Response){
        const id = req.params.id;
        const {disponibilidad, horario} = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(!disponibilidad){
                res.status(402).json(
                {message: "Horario incorrecta"}
            );
            }
        }else{
            try{
                const horarioModificado = await horarioService.editHorario(id, disponibilidad, horario);
                res.status(200).json(horarioModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public size(req:Request, res:Response){
        res.status(200).json({size: horarioService.size()})
    }
}

export default new HorarioController();