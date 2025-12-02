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

    players[socket.id] = { x: 100, y: 100 };

    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", { id: socket.id, x: 100, y: 100 });

    socket.on("move", data => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit("playerMoved", { id: socket.id, x: data.x, y: data.y });
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("playerDisconnected", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
