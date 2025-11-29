import {Router} from 'express';
import clubController from '../controllers/club.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const clubRoute = Router();

clubRoute.get("/", clubController.getClubs);
clubRoute.get("/:id", clubController.getClub);
clubRoute.post("/", authenticateToken, clubController.addClub);
clubRoute.delete("/:id", authenticateToken, clubController.deleteClub);
clubRoute.put("/:id", authenticateToken, clubController.editClub);
clubRoute.put("/:idClub/:idCancha", authenticateToken, clubController.addCanchaAClub);
clubRoute.delete("/:idClub/:idCancha", authenticateToken, clubController.deleteCanchaAClub);


export default clubRoute;