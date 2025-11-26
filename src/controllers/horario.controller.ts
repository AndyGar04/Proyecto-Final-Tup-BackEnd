import { Request, Response } from "express";
import horarioService from "../services/horario.service";
import { Horario } from "../models/horario";

class HorarioController { 
    public async getHorarios (req: Request, res: Response){
        const horarios = await horarioService.getHorarios();
        res.status(200).json(horarios); 
    }

    public async getHorario (req: Request, res: Response){
        const id = req.params.id;
        try{
            const horarios = await horarioService.getHorarios();
            const horarioEncontrado = horarios.find((horario) => horario.getId() === id);
            if(!horarioEncontrado){
                res.status(404).json({message: "Horario no encontrado"});
            }else{
                res.status(200).json(horarioEncontrado);
            }
        }catch(error){
            res.status(500).json({message: "Error al obtener el horario", error});
        }
    }

    public async addHorario(req: Request, res: Response){
        try{
            const { id, disponibilidad, horario, diaHorario } = req.body;
                if(!id){
                    res.status(402).json({message:"Id no parametrizado"});
                }else{
                    if (disponibilidad === undefined || horario === undefined || diaHorario === undefined) { 
                        res.status(402).json({message:"Disponibilidad u horario no parametrizado"});
                    } else {
                        const horarioCreado = new Horario(id, disponibilidad, horario, diaHorario);
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
        const {disponibilidad, horario, diaHorario} = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(disponibilidad === undefined || horario === undefined || diaHorario === undefined){
                res.status(402).json(
                {message: "Parametros de horarios, incorrecto"}
            );
            }
        }else{
            try{
                const horarioModificado = await horarioService.editHorario(id, disponibilidad, horario, diaHorario);
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