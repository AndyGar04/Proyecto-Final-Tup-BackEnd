import express from 'express';
import cors from 'cors';
import horarioRoute from './routes/horario.routes';
import turnoRoute from './routes/turno.routes';
import canchaRouter from './routes/cancha.routes';

class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.middlewares();
        this.routes();
        
    }

    middlewares(){
        this.app.use(express.json({limit: '150mb'}));
        //Cors
        this.app.use( cors());
    }

    routes(){
        this.app.use("/horario", horarioRoute);
        this.app.use("/turno", turnoRoute);
        this.app.use("/cancha", canchaRouter)
    }

    start(callback: () => void) {
        this.app.listen(this.port, callback);
    }
}
export default Server;