const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }

    console.log('received:', message);

    let parsedMessage = null;
    try {
      parsedMessage = JSON.parse(message);
    } catch (e) {
      console.error('Error parsing message:', e);
      return;
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
