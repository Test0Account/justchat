const WebSocket = require("ws");
const server = new WebSocket.Server({
    port: process.env.PORT || 3000
});

const rooms = {
    server1: new Set(),
    server2: new Set()
};

console.log("WebSocket backend running...");

server.on("connection", (ws, req) => {
    let roomName = req.url.replace("/", "");
    if (!rooms[roomName]) roomName = "server1";

    rooms[roomName].add(ws);

    ws.send(`[SYSTEM] Joined ${roomName}`);

    ws.on("message", (msg) => {
        for (let client of rooms[roomName]) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        }
    });

    ws.on("close", () => {
        rooms[roomName].delete(ws);
    });
});
