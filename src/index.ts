import Server from "./app";

const server = new Server(3000);
server.start(()=>{
    console.log("On port 3000")
});

async function main() {
    try {
        await server.initDatabase(); // Primero creamos las tablas
        server.start(() => {
            console.log("Servidor corriendo en el puerto 3000");
        });
    } catch (error) {
        console.error("Error fatal al iniciar la base de datos:", error);
    }
}

main();