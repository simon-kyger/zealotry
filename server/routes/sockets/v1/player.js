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
    })
    .catch( tempErrorHandler );

}

const move = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    player.pos.set("x", data.x);
    player.pos.set("y", data.y);
    socket.broadcast.emit('move', player);
    console.log('move');
}

const stop = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    player.pos.set("x", data.x);
    player.pos.set("y", data.y);
    console.log('stop');
    socket.broadcast.emit('stop', player);
}

const tempErrorHandler = error => {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}