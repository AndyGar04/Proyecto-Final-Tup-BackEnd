import {Router} from 'express';
import turnoController from '../controllers/turno.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const turnoRoute = Router();

turnoRoute.get("/", authenticateToken, turnoController.getTurnos);
turnoRoute.get("/:id", authenticateToken, turnoController.getTurno);
turnoRoute.post("/", authenticateToken, turnoController.addTurno);
turnoRoute.delete("/:id", authenticateToken, turnoController.deleteTurno);
turnoRoute.put("/:id", authenticateToken, turnoController.editTurno);
turnoRoute.put("/:idTurno/:idHorario", authenticateToken, turnoController.addHorario);
turnoRoute.delete("/:idTurno/:idHorario", authenticateToken, turnoController.deleteHorarioATurno);

export default turnoRoute;