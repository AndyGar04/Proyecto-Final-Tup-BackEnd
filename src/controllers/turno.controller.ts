import { Request, Response } from "express";
import turnoService from "../services/turno.service";
import { Turno } from "../models/turno";
import horarioService from "../services/horario.service";
import { Horario } from "../models/horario";

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
                    });
                }
            }
        }
    }

    public async addTurno(req: Request, res: Response){
        try{
            const { id, descripcionTurno, costo} = req.body;
            if(!id){
                res.status(402).json({message:"Id no parametrizado"});
            }else if(!descripcionTurno || !costo){
                res.status(402).json({message:"Descripcion turno, costo u horario no parametrizado"});
            }else{
                const turnoCreado = new Turno(id, descripcionTurno, costo);
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
        const {descripcionTurno, costo} = req.body
        if(!id){
            res.status(402).json(
                {message: "Id no definido"}
            );
            if(!costo || !descripcionTurno){
                res.status(402).json(
                {message: "Turno incorrecta"}
            );
            }
        }else{
            try{
                const turnoModificado = await turnoService.editTurno(id, descripcionTurno, costo);
                res.status(200).json(turnoModificado);
            }catch(error){
                if(error instanceof Error)
                    res.status(404).json({message:error.message})
            }
        } 
    }

    public async addHorario(req: Request, res: Response){
        const idTurno = req.params.idTurno; // ID del Turno a agregar horario
        const idHorario = req.params.idHorario; //ID del Horario a agregar horario
        const { disponibilidad, horario, diaHorario } = req.body;
        
        if(!idTurno || !idHorario){
            return res.status(402).json({message: "Id del Turno/Horario no definido"});
        }
        
        if(disponibilidad === undefined || horario === undefined || diaHorario === undefined){
            return res.status(402).json({message: "Datos del Horario incompletos"});
        }

        if (disponibilidad === "" || horario === "" || diaHorario === ""){
            return res.status(402).json({message: "Los campos no pueden estar vacíos"});
        }
        
        try{
            const nuevoHorario = new Horario(idHorario, disponibilidad, horario, diaHorario);
            const turnoModificado = await turnoService.addHorarioATurno(idTurno, nuevoHorario);
            res.status(200).json(turnoModificado);
        }catch(error){
            if(error instanceof Error)
                res.status(404).json({message: error.message});
            else 
                res.status(500).json({message: "Error al añadir horario"});
        } 
    }

    public async deleteHorarioATurno(req: Request, res: Response){
        const turnoId = req.params.idTurno;
        const horarioId = req.params.idHorario;

        if(!turnoId){
            return res.status(402).json({message: "Id del Turno no definido"});
        }

        if(!horarioId){
            return res.status(402).json({message: "Id del Horario no definido"});
        }

        try {
            const turnoModificado = await turnoService.deleteHorarioATurno(turnoId, horarioId);
            res.status(200).json(turnoModificado);
        }catch(error){
            if (error instanceof Error){
                res.status(404).json({message:error.message});
            }else{
                res.status(500).json({message: "Error al eliminar horario"});
            }
        }
    }

    public size(req:Request, res:Response){
        res.status(200).json({size: turnoService.size()})
    }
}

export default new TurnoController();