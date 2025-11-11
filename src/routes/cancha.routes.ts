import {Router} from 'express';
import canchaController from '../controllers/cancha.controller';

const canchaRouter = Router();

canchaRouter.get("/", canchaController.getCanchas);
canchaRouter.get("/:id", canchaController.getCancha);
canchaRouter.post("/", canchaController.addCancha);
canchaRouter.delete("/:id", canchaController.deleteCancha);
canchaRouter.put("/:id", canchaController.editCancha);


export default canchaRouter
;