// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const setRouter = require('./app/route/route');
const router = express.Router();
const cors = require('cors')
const http = require('http');

const bodyParser = require('body-parser');
const appconfig = require('./app/config/appConfig');

// Create an instance of Express
const app = express();

app.use(cors())

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

setRouter.setRouter(app);

const server = http.createServer(app);

// const socket = require('./app/lib/socket');
// socket.setServer(server);

// Set up the server to listen on a port
const port = process.env.PORT || 3000;

server.listen(port);
server.on('error', onerror);
server.on('listening', onlistening);

function onerror(error) {
    console.log(error)
}

// WebSocket server (outside of the serverless function)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);
        // Broadcast message to all clients
        wss.clients.forEach(function each(client) {
            console.log(client)
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

//event listener for Http server 'listening' event;
function onlistening() {
    var addr = server.address()
    var bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + addr.port;
    ('Listening on' + bind)
    console.log(bind)
}

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


mongoose.connect(appconfig.db.uri, { useUnifiedTopology: true, useNewUrlParser: true })

mongoose.connection.on('error', () => {
    console.log('data base connection is error')
})

mongoose.connection.on('open', () => {
    console.log('data base connection is open')
})

module.exports = router;

// for (let i = 0; i <= 1000000000; i++) {
//     console.log(i)
// }