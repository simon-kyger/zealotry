const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 8080;
const io = socketio(server);

app.use("/", express.static(path.join(__dirname, '/client')));
app.get('/', (req, res)=> path.join(__dirname, './client/index.html'));

server.listen(port);
console.log(`Server listening on port: ${port}`);

io.sockets.on('connection', socket =>{
	init(socket);
});

function init(socket){
	const msg = `we're connected`;
	socket.emit('helloworld', msg);
} 