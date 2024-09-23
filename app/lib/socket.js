const { Server } = require("socket.io");

let setServer = (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log(socket)
        console.log('a user connected');
        socket.on("chat message", (msg) => {
            io.emit('chat message', msg)
        });
    });

}

module.exports = {
    setServer: setServer
}