import {Router} from 'express';
import horarioController from '../controllers/horario.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const horarioRoute = Router();

horarioRoute.get("/", horarioController.getHorarios);
horarioRoute.get("/:id", horarioController.getHorario);
horarioRoute.post("/", authenticateToken, horarioController.addHorario);
horarioRoute.delete("/:id", authenticateToken, horarioController.deleteHorario);
horarioRoute.put("/:id", authenticateToken, horarioController.editHorario);

//Test de postman pasados

export default horarioRoute;