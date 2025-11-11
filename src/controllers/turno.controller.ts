import { Request, Response } from "express";
import turnoService from "../services/turno.service";
import { Turno } from "../models/turno";

class TurnoController { 
    public async getTurnos (req: Request, res: Response){
        const turnos = await turnoService.getTurnos();
        res.status(200).json(turnos); 
    }

    public async getTurno(req: Request, res:Response){
            const id = req.params.id;
            if(!id){
                res.status(402).json({message: "Id no definido"});
            }else{
                try{
                    const turno = await turnoService.getTurno(id);
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

    public async addTurno(req: Request, res: Response){
        try{
            const id = req.params.id;
            if(!id){
                res.status(402).json({message:"Id no parametrizado"});
            }else{
                const { disponibilidad, costo, horario } = req.body;
                const turnoCreado = new Turno(disponibilidad, costo, id, horario);
                const nuevoTurno = await turnoService.addTurno(turnoCreado);
                res.status(202).json(nuevoTurno);
            }    
        }catch(error){
            res.status(500).json({ message: "Error al agregar turno", error});
        }    
    }

    public deleteTurno(req: Request, res: Response){
        const id = req.params.id;
        if(!id){
            res.status(402).json({message: "Id no definido"});
        }else{
            try{
                turnoService.deleteTurno(id);
                res.status(200).json({message: "Turno eliminada"});
            }catch(error){
                if (error instanceof Error){
                    res.status(404).json({message: error});
                }
            }
        }
    }

    public async editTurno(req: Request, res: Response){
        const id = req.params.id;
        const {disponibilidad, costo, horario} = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(!costo || !disponibilidad || !horario){
                res.status(402).json(
                {message: "Turno incorrecta"}
            );
            }
        }else{
            try{
                const turnoModificado = await turnoService.editTurno(id, disponibilidad, costo, horario);
                res.status(200).json(turnoModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public async confirmarTurno(req: Request, res: Response){
        const id = req.params.id;
        const {disponibilidad} = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(!disponibilidad){
                res.status(402).json(
                {message: "Turno incorrecta"}
            );
            }
        }else{
            try{
                const turnoModificado = await turnoService.confirmarTurno(id, disponibilidad);
                res.status(200).json(turnoModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public size(req:Request, res:Response){
        res.status(200).json({size: turnoService.size()})
    }
}

export default new TurnoController();