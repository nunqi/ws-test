require('dotenv').config();
const WebSocket = require('ws');
const WebSocketServer = WebSocket.WebSocketServer;
const MessageRepository = require('./database/repositories/message-repo');
const sequelize = require('./database');
const bcrypt = require('bcrypt');

const wss = new WebSocketServer({ port: 8080 });
const mRepo = new MessageRepository();

sequelize.sync({ force: false }).then();

const saltRounds = 10;
const secret = "s3cr3t";

wss.on('connection', (ws) => {
    console.log('new connection');

    ws.on('error', console.error);

    ws.on('message', async (rawData) => {
        let data = JSON.parse(rawData);
        console.log(`${data.author}: ${data.message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(rawData.toString());
            }
        });
        await mRepo.insert({ author: data.author, message: data.message });
    });
});
