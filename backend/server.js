const http = require("http");
const WebSocket = require("ws");

// Create HTTP server (Render NEEDS this)
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket server is running.");
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

let rooms = {
    server1: new Set(),
    server2: new Set()
};

wss.on("connection", (ws, req) => {
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

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
