const http = require("http");
const WebSocket = require("ws");
const express = require('express');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const WebSocketServer = new WebSocket.Server({ server });

let clients = [];

WebSocketServer.on("connection", ws => {
    console.log("New Connection");
    clients.push(ws);
    
    ws.on("message", message => {
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        clients = clients.filter(client => client !== ws);
        console.log("Connection closed");
    });

    ws.on("error", error => {
        console.error("WebSocket error observed:", error);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor websocket listening on port ${PORT}`);
});
