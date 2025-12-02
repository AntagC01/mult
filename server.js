const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve index.html and all other files
app.use(express.static(__dirname));

let players = {};

io.on("connection", socket => {
    console.log("New player:", socket.id);

    // Player padrão (fixo, sem movimento)
    players[socket.id] = { x: 100, y: 100 };

    // Envia lista atual para quem entrou
    socket.emit("currentPlayers", players);

    // Notifica os outros
    socket.broadcast.emit("newPlayer", { id: socket.id, x: 100, y: 100 });

    // === NOVO: Mensagem para todos ===
    socket.on("broadcastMessage", msg => {
        io.emit("broadcastMessage", msg);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("playerDisconnected", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
