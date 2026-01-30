import 'dotenv/config';
import Server from "./app";
import { initializeAdmin } from "./scripts/initAdmin";
const server = new Server(3000);
const app = server.app;

async function main() {
    try {
        await server.initDatabase();
        await initializeAdmin();
        console.log("Base de datos lista y usuarios creados");
    } catch (error) {
        console.error("Error al iniciar DB:", error);
    }
}

main();

export default app;