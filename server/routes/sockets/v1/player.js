import SocketsV1 from './index';
import { socketControllerHandler } from '../../../util/controllerHandler';
import UserController from '../../../controllers/user';
import CharacterController from '../../../controllers/character';
import Server from '../../../index';

export const NEW_PLAYER = "newplayer";
export const PLAY_GAME = "playgame";

export function init(socket) {

    // Clean all this up later
    socket.on('playgame', data => playGame(socket, data));
    socket.on('move', data => move(socket, data));  
    socket.on('stop', data => stop(socket, data));
}

let messageQueue = {};

export function playGame(socket, data){
    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {
        msg: 'Entering game...'
    });
    CharacterController.getByName(data)
    .then(result => {
        socket.name = result.name;
        const otherplayers = Server.players.slice(0);
        Server.players.push(result);
        SocketsV1.emit(NEW_PLAYER, result);
        socket.emit(PLAY_GAME, {
            player: result,
            players: otherplayers
        });
        messageQueue[result.name] = {
            lastMessageId: 0,
            queue : []
        }
    })
    .catch( tempErrorHandler );

}

const action = (socket, data) => {
    if (data.action === 'move') {
        move(socket,data);
    } else if (data.action === 'stop') {
        stop(socket,data);
    }
}

const move = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    player.pos.set("x", data.x);
    player.pos.set("y", data.y);
    if (messageQueue[player.name].lastMessageId == data.messageId - 1) {
        socket.broadcast.emit('move', player);
        messageQueue[player.name].lastMessageId++;
    } else {
        data.action = 'move';
        messageQueue[player.name].queue.push(data);
        messageQueue[player.name].queue.forEach((item, i) => {
            if (item.messageId == data.messageId -1 ) {
                messageQueue[player.name].queue.splice(i,1);
                action(socket, item);
            }
        });
    }
}

const stop = (socket, data) => {
    console.log('Stop took:', Date.now()-data.time);
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    player.pos.set("x", data.x);
    player.pos.set("y", data.y);
    if (messageQueue[player.name].lastMessageId == data.messageId - 1) {
        socket.broadcast.emit('stop', player);
        messageQueue[player.name].lastMessageId++;
    } else {
        data.action = 'stop';
        messageQueue[player.name].queue.push(data);
        messageQueue[player.name].queue.forEach( (item,i) => {
            if (item.messageId == data.messageId -1 ) {
                messageQueue[player.name].queue.splice(i,1);
                action(socket, item);
            }
        });
    }    
}

const tempErrorHandler = error => {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}