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
        try {
            const { descripcionTurno, costo } = req.body;

            if (!descripcionTurno || costo === undefined) {
                return res.status(400).json({ message: "Faltan datos: descripcionTurno o costo" });
            }

            const nuevoTurnoReq = new Turno("0", descripcionTurno, costo);
            const turnoCreado = await turnoService.addTurno(nuevoTurnoReq);
            
            res.status(201).json(turnoCreado);
        } catch (error) {
            res.status(500).json({ message: "Error al añadir turno", error: String(error) });
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

    public async addHorarioATurno(req: Request, res: Response){
        try {
            const idTurno = req.params.idTurno;
            const { disponibilidad, horario, diaHorario } = req.body;

            if (!idTurno || disponibilidad === undefined || !horario || !diaHorario) {
                return res.status(400).json({ message: "Faltan parametros para el horario" });
            }

            const fechaDate = new Date(diaHorario);

            const nuevoHorario = new Horario("0", disponibilidad, horario, fechaDate);
            
            const turnoModificado = await turnoService.addHorarioATurno(idTurno, nuevoHorario);
            res.status(200).json(turnoModificado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al añadir horario al turno", error: String(error) });
        } 
    }

    public async deleteHorarioATurno(req: Request, res: Response) {
        const turnoId = req.params.idTurno;
        const horarioId = req.params.idHorario;

        // Validación de parámetros
        if (!turnoId || !horarioId) {
            return res.status(400).json({ message: "Id del Turno o Horario no definido" });
        }

        try {
            // Llamamos al servicio con await
            const turnoModificado = await turnoService.deleteHorarioATurno(turnoId, horarioId);
            
            // Devolvemos el turno actualizado (sin el horario eliminado)
            res.status(200).json(turnoModificado);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            } else {
                return res.status(500).json({ message: "Error al eliminar el horario del turno" });
            }
        }
    }

    public size(req:Request, res:Response){
        res.status(200).json({size: turnoService.size()})
    }
}

export default new TurnoController();