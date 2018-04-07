import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';
import {mongoclient} from 'mongodb';
import bcrypt from 'bcryptjs';

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 80;
const io = socketio(server);

app.use("/", express.static(path.join(__dirname, '/client')));
app.get('/', (req, res)=> path.join(__dirname, './client/index.html'));

server.listen(port);
console.log(`Server listening on port: ${port}`);

io.sockets.on('connection', socket =>{
	init(socket);
	//socket.on('register', register());
});

const init = socket => {
	const msg = `we're connected`;
	socket.emit('helloworld', msg);
}

const register = socket => {

}