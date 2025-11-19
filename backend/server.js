const WebSocket = require("ws");
const server = new WebSocket.Server({ port: process.env.PORT || 3000 });

let rooms = {
    server1: new Set(),
    server2: new Set()
};

server.on("connection", (ws, req) => {
    const url = req.url.replace("/", "");
    const roomName = rooms[url] ? url : "server1";

    rooms[roomName].add(ws);

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
