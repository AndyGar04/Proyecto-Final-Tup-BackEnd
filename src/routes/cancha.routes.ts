import {Router} from 'express';
import CanchaController from './../../src/controllers/cancha.controller'

const canchaRouter = Router();

canchaRouter.get("/", CanchaController.getCanchas);
canchaRouter.get("/:id", CanchaController.getCancha);
canchaRouter.post("/", CanchaController.addCancha);
canchaRouter.delete("/:id", CanchaController.deleteCancha);
canchaRouter.put("/:id", CanchaController.editCancha);


export default canchaRouter
;