import Server from "./app";

const server = new Server(3000);
server.start(()=>{
    console.log("On port 3000")
});