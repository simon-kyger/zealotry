import * as UserSockets from './user';
import * as PlayerSockets from './player';
import Server from '../../../main';
import { platform } from 'os';

export const LOGIN_REQUIRED = "loginreq";
export const DISCONNECT = "disconnect";
export const CONNECTED = "helloworld";

export const USER_CREATED = "usercreated";
export const USER_LOGIN_SUCCESS = "loginsuccess"
export const CHARACTER_CREATE_FAIL = "failcreate";
export const USER_GET_CHARACTER_LIST = "characterlist";
export const CHARACTER_CREATE_SUCESS = "createcharsuccess";
export const REALM_PICK = "realmpick";

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


export default {
    LOGIN_REQUIRED,
    DISCONNECT,
    CONNECTED,
    USER_CREATED,
    USER_LOGIN_SUCCESS,
    CHARACTER_CREATE_FAIL,
    USER_GET_CHARACTER_LIST,
    CHARACTER_CREATE_SUCESS,
    REALM_PICK,

    init,
    emit
}
