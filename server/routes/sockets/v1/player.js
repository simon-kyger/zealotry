import * as SocketsV1 from './index';
import { socketControllerHandler } from '../../../util/controllerHandler';
import * as UserController from '../../../controllers/user';
import * as Server from '../../../index';

export const NEW_PLAYER = "newplayer";
export const PLAY_GAME = "playgame";

export function init(socket) {

    // Clean all this up later
    socket.on('playgame', data => playGame(socket, data));
    socket.on('move', data => move(socket, data));  
}

function playGame(socket, data) {
    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {
        msg: 'Entering game...'
    });
    UserController.get(Server.getUsernameBySocket(socket))
    .then( result => {
        if (result) {
            // TODO: Refactor
            let player = result.characters.find(character=> character.name===data);
            socket.name = player.name;
            Server.players.push(player);
            SocketsV1.emit(NEW_PLAYER, player);
            socket.emit(PLAY_GAME, {
                player: player,
                players: Server.players
            });
        }
    })
    .catch( tempErrorHandler );

}

function move(socket, data) {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    if (data.state){
        player.move[data.dir] = true;
    } else {
        player.move[data.dir] = false;
    }
    SocketsV1.emit('move', player);
}

function tempErrorHandler(error) {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}