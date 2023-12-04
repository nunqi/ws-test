require('dotenv').config();
const WebSocket = require('ws');
const WebSocketServer = WebSocket.WebSocketServer;
const express = require('express');

const MessageRepository = require('./database/repositories/message-repo');
const sequelize = require('./database');

const crypto = require('crypto');
const secret = "s3cr3t";
const createhmac = crypto.createHmac('sha1', secret);

const wss = new WebSocketServer({ port: 8080 });
const mRepo = new MessageRepository();

const app = express();
const port = 3000;

sequelize.sync({ force: true }).then();

// ChatGPT code
function encrypt(text, encryptionKey, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}
function decrypt(encryptedText, encryptionKey, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
const encryptionKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


wss.on('connection', (ws) => {
    console.log('new connection');

    ws.on('error', console.error);

    ws.on('message', (rawData) => {
        let data = JSON.parse(rawData);
        console.log(`${data.author}: ${data.message}`);

        mRepo.insert({ 
            author: encrypt(data.author, encryptionKey, iv),
            message: encrypt(data.message, encryptionKey, iv)
        });

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(rawData.toString());
            }
        });
    });
});

app.get('/', async (req, res) => {
    const messages = await mRepo.findAll();
    let result = []
    messages.forEach((message) => {
        result.push({
            author: decrypt(message.author, encryptionKey, iv),
            message: decrypt(message.message, encryptionKey, iv)
        });
    });
    res.send(result);
});

app.listen(port);
