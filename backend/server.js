const WebSocket = require("ws");
const http = require("http");

// Create HTTP server (Render needs this)
const server = http.createServer();

const wss = new WebSocket.Server({ server });

const rooms = {
    server1: new Set(),
    server2: new Set()
};

wss.on("connection", (socket, req) => {
    const roomName = req.url.substring(1) || "server1";
    const room = rooms[roomName] || rooms.server1;

    room.add(socket);

    socket.on("message", (msg) => {
        for (const client of room) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        }
    });

    socket.on("close", () => {
        room.delete(socket);
    });
});

// Use Render port or fallback
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("justchat backend running on port " + PORT);
});
