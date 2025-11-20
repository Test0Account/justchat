const WebSocket = require("ws");

const port = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port });

console.log("WebSocket running on port", port);

let rooms = {
    server1: new Set(),
    server2: new Set()
};

wss.on("connection", (ws, req) => {
    const path = req.url.replace("/", "");
    const room = rooms[path] ? path : "server1";

    rooms[room].add(ws);

    ws.on("message", msg => {
        for (let client of rooms[room]) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        }
    });

    ws.on("close", () => rooms[room].delete(ws));
});
