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
console.log(`${new Date().toLocaleString()}: Server listening on port: ${port}`);

mongo.connect(dburl, (err, database)=>{
	if (err) throw err;

	console.log(`${new Date().toLocaleString()}: Mongodb is listening.`);
	let db = database.db(dbname);
	io.sockets.on('connection', socket =>{
		init(socket);
		socket.on('register', data => register(socket, db, data));
		socket.on('loginreq', ()=> socket.emit('loginreq'));
		socket.on('login', data=> login(socket, db, data));
		socket.on('disconnect', ()=> disconnect(socket));
		socket.on('createchar', data=>createchar(socket, db, data));
		socket.on('playgame', data=>playgame(socket, db, data));
		socket.on('move', data=> move(socket, data));
	});
});

const getusername = socket => Object.keys(sessions).find(key => sessions[key] === socket)
const findplayerbysocket = socket => players.find(player=> player.name === socket.name)

const init = socket => {
	const msg = `we're connected`;
	socket.emit('helloworld', msg);
}

const mapconstraints = {
	left: 0,
	top: 0,
	right: 16000 - 600,
	bottom: 16000 - 300
}

const move = (socket, data)=> {
	let player = findplayerbysocket(socket) || null;
	if (!player) return;
	player.speed = 10;
	if (data.state){
		player.move[data.dir] = true;
	} else {
		player.move[data.dir] = false;
	}
	io.sockets.emit('move', player);
}

const disconnect = socket => {
	let player = findplayerbysocket(socket) || null;
	if (player) {
		players.splice(players.indexOf(player), 1);
		io.sockets.emit('removeplayer', player)
	}
	for (let user in sessions){
		if (socket == sessions[user]){
			delete sessions[user];
			break;
		}
	}
}

const playgame = (socket, db, data)=> {
	socket.emit('failcreate', {
		msg: `Entering game...`
	});
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
		//check if player is a result of the accounts characters
		if (!res.characters.find(character=> character.name===data)){
			socket.emit('failcreate', {msg: `This character doesnt belong to your account.`});
			return;
		}
		let player = res.characters.find(character=> character.name===data);
		socket.name = player.name;
		players.push(player);
		io.sockets.emit('newplayer', player);
		socket.emit('playgame', {
			player: player,
			players: players
		});
	})
}

const createchar = (socket, db, data)=>{
	socket.emit('failcreate', {
		msg: `Creating character...`
	});
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
		users.update(
			{username: username},  
			{ 
				$push: { 
					characters: {
						name: data.name, 
						class: data.class,
						pos: {
							x: 0,
							y: 0
						},
						move: {
							left: false,
							right: false,
							up: false,
							down: false
						},
						dir: 'down',
						speed: 4
					}
				}
			},
			(err, res)=>{
				if (err){
					console.log(err);
					return;
				}
				users.findOne({username: username}).then(res=>{
					socket.emit('createcharsuccess', res);
				})
			}
		)
	})
}

const register = (socket, db, data) => {
	socket.emit('usercreated', {
		msg: `Creating account...`
	});
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
	socket.emit('usercreated', {
		msg: `Logging in...`
	});
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

setInterval(()=>{
	players.forEach(player=>{
		if (player.move.left){
			player.pos.x-= player.speed;
		} else if (player.move.right){
			player.pos.x+= player.speed;
		}
		if (player.move.up){
			player.pos.y-= player.speed;
		} else if (player.move.down){
			player.pos.y+= player.speed;
		}
		
		if (player.pos.x < mapconstraints.left)
			player.pos.x = mapconstraints.left;
		if (player.pos.x > mapconstraints.right)
			player.pos.x = mapconstraints.right;
		if (player.pos.y < mapconstraints.top)
			player.pos.y = mapconstraints.top;
		if (player.pos.y > mapconstraints.bottom)
			player.pos.y = mapconstraints.bottom;
	})
}, 100);