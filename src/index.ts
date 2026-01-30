import Server from "./app";

const server = new Server(3000);
const app = server.app;

async function main() {
    try {
        await server.initDatabase();
        console.log("Base de datos lista");
    } catch (error) {
        console.error("Error al iniciar DB:", error);
    }
}

main();

export default app;