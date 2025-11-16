import {Router} from 'express';
import clubController from '../controllers/club.controller';

const clubRoute = Router();

clubRoute.get("/", clubController.getClubs);
clubRoute.get("/:id", clubController.getClub);
clubRoute.post("/", clubController.addClub);
clubRoute.delete("/:id", clubController.deleteClub);
clubRoute.put("/:id", clubController.editClub);
clubRoute.put("/:idClub/:idCancha", clubController.addCanchaAClub);
clubRoute.delete("/:idClub/:idCancha", clubController.deleteCanchaAClub);


export default clubRoute;