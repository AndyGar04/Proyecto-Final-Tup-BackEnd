import {Router} from 'express';
import TurnoController from './../../src/controllers/turno.controller'

const turnoRoute = Router();

turnoRoute.get("/", TurnoController.getTurnos);
turnoRoute.get("/:id", TurnoController.getTurno);
turnoRoute.post("/", TurnoController.addTurno);
turnoRoute.delete("/:id", TurnoController.deleteTurno);
turnoRoute.put("/:id", TurnoController.editTurno);
turnoRoute.put("/:id", TurnoController.confirmarTurno);

export default turnoRoute;