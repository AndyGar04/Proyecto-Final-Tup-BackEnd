import {Router} from 'express';
import canchaController from '../controllers/cancha.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const canchaRouter = Router();

canchaRouter.get("/", canchaController.getCanchas);
canchaRouter.get("/:id", canchaController.getCancha);
canchaRouter.post("/", authenticateToken, canchaController.addCancha);
canchaRouter.delete("/:id", authenticateToken, canchaController.deleteCancha);
canchaRouter.put("/:id", authenticateToken, canchaController.editCancha);


export default canchaRouter
;