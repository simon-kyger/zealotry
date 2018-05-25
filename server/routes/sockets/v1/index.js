import * as UserSockets from './user';
import * as PlayerSockets from './player';
import * as Server from '../../../';
import { platform } from 'os';

export const LOGIN_REQUIRED = "loginreq";
export const DISCONNECT = "disconnect";
export const CONNECTED = "helloworld";

export const USER_CREATED = "usercreated";
export const USER_LOGIN_SUCCESS = "loginsuccess"
export const CHARACTER_CREATE_FAIL = "failcreate";
export const CHARACTER_CREATE_SUCESS = "createcharsuccess";

let _io;

export function init(io) {
    _io = io;
    io.sockets.on('connection', socket => {        
        
        // WTF is this? 
        socket.on(LOGIN_REQUIRED, ()=> socket.emit(LOGIN_REQUIRED));		

        // Also this, wtf!
        const msg = `we're connected`;
        socket.emit(CONNECTED, msg);

        socket.on(DISCONNECT, ()=> disconnect(socket));
        
        // Initailize User socket handling
        UserSockets.init(socket);
        // Initialize Player socket handling
        PlayerSockets.init(socket);

    });
}

// TODO: Refactor this and move it into session management
function disconnect (socket)  {
    let player = Server.findPlayerBySocket(socket) || null;
    if (player) {
        Server.players.splice(Server.players.indexOf(player), 1);
        emit('removeplayer', player)
    }
    for (let user in Server.sessions){
        if (socket == Server.sessions[user]){
            delete Server.sessions[user];
            break;
        }
    }
}

export function emit( type, message ) { 
    return _io.sockets.emit(type, message);
}

