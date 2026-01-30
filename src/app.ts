import express from 'express';
import cors from 'cors';
import horarioRoute from './routes/horario.routes';
import turnoRoute from './routes/turno.routes';
import canchaRouter from './routes/cancha.routes';
import clubRoute from './routes/club.routes';
import authRoute from './routes/auth.routes';
import { initDb } from './database/database';

class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.middlewares();
        this.routes();
        
    }

    async initDatabase(){
        await initDb();
        console.log("Base de datos inicializada")
    }

    middlewares(){
        this.app.use(express.json({limit: '150mb'}));
        this.app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"]
        }));
    }

    routes(){
        this.app.use("/auth", authRoute);
        this.app.use("/horario", horarioRoute);
        this.app.use("/turno", turnoRoute);
        this.app.use("/cancha", canchaRouter);
        this.app.use("/club", clubRoute);
    }

    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}
export default Server;