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
}

export function playGame(socket, data){
    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {
        msg: 'Entering game...'
    });
    CharacterController.getByName(data)
    .then(result => {
        socket.name = result.name;
        Server.players.push(result);
        SocketsV1.emit(NEW_PLAYER, result);
        socket.emit(PLAY_GAME, {
            player: result,
            players: Server.players
        });
    })
    .catch( tempErrorHandler );

}

const move = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    if (data.state){
        player.move.set(data.dir,true);        
    } else {
        player.move.set(data.dir,false);
    }
    if (player.move.get("left")){
        player.pos.set("x", Math.floor(player.pos.get("x")));
    } else if (player.move.get("right")){
        player.pos.set("x", Math.floor(player.pos.get("x")));
    }
    if (player.move.get("up")){
        player.pos.set("y", Math.floor(player.pos.get("y")));
    } else if (player.move.get("down")){
        player.pos.set("y", Math.floor(player.pos.get("y")));
    }
    Server.getIo().emit('move', Server.players);
}

const tempErrorHandler = error => {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}