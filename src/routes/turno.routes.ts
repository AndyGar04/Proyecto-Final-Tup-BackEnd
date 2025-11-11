import {Router} from 'express';
import turnoController from '../controllers/turno.controller';

const turnoRoute = Router();

turnoRoute.get("/", turnoController.getTurnos);
turnoRoute.get("/:id", turnoController.getTurno);
turnoRoute.post("/", turnoController.addTurno);
turnoRoute.delete("/:id", turnoController.deleteTurno);
turnoRoute.put("/:id", turnoController.editTurno);
turnoRoute.put("/:id", turnoController.confirmarTurno);

export default turnoRoute;