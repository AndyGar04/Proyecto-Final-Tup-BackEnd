import { Request, Response } from "express";
import horarioService from "../services/horario.service";
import turnoService from "../services/turno.service";
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
            const { disponibilidad, horario, diaHorario, idTurno } = req.body; 
            
            if(disponibilidad === undefined || horario === undefined || diaHorario === undefined || idTurno === undefined) { 
                res.status(402).json({message:"Faltan parametros: disponibilidad, diaHorario, horario o idTurno"});
            } else {
                
                const turnoExistente = await turnoService.getTurno(idTurno);
                const horariosActuales = turnoExistente.getHorarios();
                const fechaNueva = new Date(diaHorario);

                const yaExiste = horariosActuales.some(h => 
                    h.getHorario() === horario && 
                    h.getDiaHorario().toDateString() === fechaNueva.toDateString()
                );

                if (yaExiste) {
                    return res.status(409).json({ message: "Ya existe un horario para este turno en esa hora y día." });
                }

                const horarioCreado = new Horario("0", disponibilidad, horario, fechaNueva, idTurno);
                const nuevoHorario = await horarioService.addHorario(horarioCreado);
                res.status(202).json(nuevoHorario);
            }    
        } catch(error) {
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
        const {disponibilidad, horario, diaHorario, idTurno} = req.body; // Capturar idTurno
        
        if(!id || !idTurno) {
            return res.status(402).json({message: "Id de horario o idTurno no definido"});
        }

        if(disponibilidad === undefined || horario === undefined || diaHorario === undefined) {
            return res.status(402).json({message: "Parámetros de horarios incorrectos"});
        }

        try {
            const fechaConvertida = new Date(diaHorario);
            const horarioModificado = await horarioService.editHorario(
                id, 
                disponibilidad, 
                horario, 
                fechaConvertida,
                idTurno
            );
            res.status(200).json(horarioModificado);
        } catch(error) {
            if(error instanceof Error)
                res.status(404).json({message: error.message})
        }
    }

    public async size(req:Request, res:Response){
        res.status(200).json({size: await horarioService.size()})
    }
}

export default new HorarioController();