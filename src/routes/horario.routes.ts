import {Router} from 'express';
import HorarioController from './../../src/controllers/horarios.controller'

const horarioRoute = Router();

horarioRoute.get("/", HorarioController.getHorarios);
horarioRoute.get("/:id", HorarioController.getHorarios);
horarioRoute.post("/", HorarioController.addHorario);
horarioRoute.delete("/:id", HorarioController.deleteHorario);
horarioRoute.put("/:id", HorarioController.editHorario);

export default horarioRoute;