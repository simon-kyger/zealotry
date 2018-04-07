import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import path from 'path';
import {MongoClient as mongo} from 'mongodb';
import sanitize from 'mongo-sanitize';
import bcrypt from 'bcryptjs';

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 80;
const io = socketio(server);
const dbport = process.env.DBPORT || 27017;
const dbname = process.env.DBNAME || `zealotrydb`;
const dburl = process.env.MONGODB_URI || `mongodb://localhost:${dbport}`;
let sessions = {};

app.use("/", express.static(path.join(__dirname, '/client')));
app.get('/', (req, res)=> path.join(__dirname, './client/index.html'));

server.listen(port);
console.log(`Server listening on port: ${port}`);

mongo.connect(dburl, (err, database)=>{
	if (err) throw err;

	console.log(`Mongodb is listening.`);
	let db = database.db(dbname);
	io.sockets.on('connection', socket =>{
		init(socket);
		socket.on('register', data => register(socket, db, data));
		socket.on('login', data=> login(socket, db, data));
		socket.on('disconnect', ()=> disconnect(socket));
	});
});

const init = socket => {
	const msg = `we're connected`;
	socket.emit('helloworld', msg);
}

const disconnect = socket => {
	for (let user in sessions){
		if (socket == sessions[user]){
			delete sessions[user];
			break;
		}
	}
}

const register = (socket, db, data) => {
	if (!data.username) {
		socket.emit('usercreated', {
			msg: `Enter a new username to register.`
		});
		return;
	}
	if (!data.password) {
		socket.emit('usercreated', {
			msg: `Enter a password.`
		});
		return;
	}
	if ((data.username.indexOf("<") > -1) || (data.username.indexOf(">") > -1) || (data.username.indexOf('&') > -1)) {
		socket.emit('usercreated', {
			msg: `Characters <, >, and & are not permitted in usernames. Choose a new name.`
		});
		return;
	}

	let users = db.collection('users');

	let query = sanitize(data);
	const h = query.username + query.password;
	bcrypt.hash(h, 13, (err, hash) => {
		users.findOne({ username: query.username }).then(res => {
			if (res) {
				socket.emit('usercreated', {
					msg: `User: ${query.username} already exists.`
				});
				return;
			}
			users.insert({ username: query.username, password: hash}, (err, user) => {
				if (err) {
					socket.emit('usercreated', {
						msg: `DB is having issues. Please contact admin.`
					});
					return;
				}
				socket.emit('usercreated', {
					msg: `User ${query.username} has been created.`
				});
			});
		});
	});
}

const login = (socket, db, data) => {
	if (!data.username) {
		socket.emit('usercreated', {
			msg: `Enter a valid username.`
		});
		return;
	}
	if (!data.password) {
		socket.emit('usercreated', {
			msg: `Enter a valid password.`
		});
		return;
	}

	let users = db.collection('users');

	let query = sanitize(data);

	users.findOne({ username: query.username }).then(res => {
		if (!res) {
			socket.emit('usercreated', {
				msg: `Incorrect username and or password.`
			});
			return;
		}
		socket.emit('usercreated', {
			msg: `Logging in...`
		});

		const a = query.username + query.password;
		const h = res.password;

		bcrypt.compare(a, h, (err, res2) => {
			for (let user in sessions) {
				if (user == res.username) {
					socket.emit('usercreated', {
						msg: `User is already signed in.`
					});
					return;
				}
			}
			if (res2) {
				sessions[res.username] = socket;
				socket.emit('loginsuccess', {
					username: res.username,
					characters: res.characters || null
				});
			}
			else {
				socket.emit('usercreated', {
					msg: `Incorrect username and or password.`
				});
			}
		})
	})
}