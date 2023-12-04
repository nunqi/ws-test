import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('new connection');

    ws.on('error', console.error);

    ws.on('message', (rawData) => {
        let data = JSON.parse(rawData)
        console.log(`${data.author}: ${data.message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(rawData.toString());
            }
        });
    });
})
