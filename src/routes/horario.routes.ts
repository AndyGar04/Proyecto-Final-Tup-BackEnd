import {Router} from 'express';
import horarioController from '../controllers/horario.controller';

const horarioRoute = Router();

horarioRoute.get("/", horarioController.getHorarios);
horarioRoute.get("/:id", horarioController.getHorario);
horarioRoute.post("/", horarioController.addHorario);
horarioRoute.delete("/:id", horarioController.deleteHorario);
horarioRoute.put("/:id", horarioController.editHorario);

export default horarioRoute;