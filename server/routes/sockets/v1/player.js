import SocketsV1 from './index';
import { socketControllerHandler } from '../../../util/controllerHandler';
import UserController from '../../../controllers/user';
import CharacterController from '../../../controllers/character';
import Server from '../../../main';

export const NEW_PLAYER = "newplayer";
export const PLAY_GAME = "playgame";

export function init(socket) {

    // Clean all this up later
    socket.on('playgame', data => playGame(socket, data));
    socket.on('move', data => move(socket, data));  
    socket.on('ability1', data => ability1(socket, data));
    socket.on('queueattack', data => queueattack(socket, data));
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

const ability1 = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    let target = Server.findPlayerById(data.target_id)
    
    if (!player || !target) 
        return;
    player.x = data.x;
    player.y = data.y;
    const rangecheck = Server.allAbilities(player.abilities[0]).rangecheck(player, target);
    if (rangecheck){
        Server.allAbilities(player.abilities[0]).execute(player, target);
        SocketsV1.emit('ability1', {
            target: target,
            attacker: player,
        });
    } else {
        SocketsV1.emit('outofrange', {
            target: target,
            attacker: player,
        });
    }
}

const move = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    player.velocity = data.velocity;
    player.x = data.x;
    player.y = data.y;
    SocketsV1.emit('move', player);
}

const queueattack = (socket, data) => {
    let player = Server.findPlayerBySocket(socket) || null;
    let target = Server.findPlayerById(data.target_id)
    if (!player || !target) 
        return;
    player.x = data.x;
    player.y = data.y;
    const rangecheck = Server.allAbilities(player.abilities[0]).rangecheck(player, target);
    if (rangecheck){
        SocketsV1.emit('queueattack', player._id);
    } else {
        SocketsV1.emit('outofrange', {
            target: target,
            attacker: player,
            rangecheck: rangecheck
        });
    }
}

const tempErrorHandler = error => {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}