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
let players = [];

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
		socket.on('createchar', data=>createchar(socket, db, data));
		socket.on('playgame', data=>playgame(socket, db, data));
	});
});

const getusername = socket => Object.keys(sessions).find(key => sessions[key] === socket)
const findplayerbysocket = socket => players.find(player=> player.name === socket.character.name)

const init = socket => {
	const msg = `we're connected`;
	socket.emit('helloworld', msg);
}

const disconnect = socket => {
	let player = findplayerbysocket(socket);
	if (player) players.splice(players.indexOf(player), 1);
	for (let user in sessions){
		if (socket == sessions[user]){
			delete sessions[user];
			break;
		}
	}
}

const playgame = (socket, db, data)=> {
	if (!data){
		socket.emit('failcreate', {
			msg: `Reload client because something dreadful happened`
		});
		return;
	}
	let users = db.collection('users');
	let query = sanitize(data);
	let username = getusername(socket);
	users.findOne({username: username}).then(res=>{
		if (!res){
			socket.emit('failcreate', {msg: `DB is having issues try again later.`});
			return;
		}
		if (!res.characters.find(character=> character.name===data)){
			socket.emit('failcreate', {msg: `This character doesnt belong to your account.`});
			return;
		}
		let char = res.characters.find(character=> character.name===data);
		socket.character = char;
		players.push(char);
		socket.emit('playgame', {
			char,
			players
		});
	})
}

const createchar = (socket, db, data)=>{
	if (!data.class || !data.name){
		socket.emit('failcreate', {
			msg: `Invalid data`
		});
		return;
	}
	let users = db.collection('users');
	let query = sanitize(data);
	let username = getusername(socket);
	users.find({"characters.name": data.name}).count().then(res=>{
		if (res){
			socket.emit('failcreate', {
				msg: `Character already exists with that name.`
			});
			return;
		}
		users.update({username: username},  
			{ 
				$push: { 
					characters: {
						name: data.name, 
						class: data.class
					}
				}
			}
		)
		users.findOne({username: username}).then(res=>{
			socket.emit('createcharsuccess', res);
		})
	});
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
			users.insert({ username: query.username, password: hash, characters: []}, (err, user) => {
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