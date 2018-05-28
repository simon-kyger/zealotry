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

function playGame(socket, data) {
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

function move(socket, data) {
    let player = Server.findPlayerBySocket(socket) || null;
    if (!player) return;
    if (data.state){
        player.move.set(data.dir,true);        
    } else {
        player.move.set(data.dir,false);
    }
    if (data.state) {
        if ([ ...player.move.values() ].filter( val => val == true).length > 1) {
            player.move.set(data.dir,false); 
            calcPlayerMovement(player, Date.now() - player.startedMoving);
            player.move.set(data.dir,true);            
            player.startedMoving = Date.now();
        } else {
            player.startedMoving = Date.now();
        }
    } else if ([ ...player.move.values() ].find( val => val == true)) {
        player.move.set(data.dir,true); 
        calcPlayerMovement(player, Date.now() - player.startedMoving);
        player.move.set(data.dir,false);
        player.startedMoving = Date.now();
    } else {
        // Temp fix
        player.move.set(data.dir,true); 
        calcPlayerMovement(player, Date.now() - player.startedMoving);
        player.move.set(data.dir,false); 
    }
    SocketsV1.emit('move', player);
}

function tempErrorHandler(error) {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}

// Move this into individual map objects
const mapconstraints = {
	left: 0,
	top: 0,
	right:  16000*3 -1920, //mapwidth * scale - canvassize
	bottom: 16000*3 -950 //mapheight * scale - canvassize
}

function calcPlayerMovement(player, timeElapsed) {
    let deltaPos = player.speed * (timeElapsed / 62.5);
    if (player.move.get("left")){
        player.pos.set("x", player.pos.get("x") - deltaPos);
    } else if (player.move.get("right")){
        player.pos.set("x", player.pos.get("x") + deltaPos);
    }
    if (player.move.get("up")){
        player.pos.set("y", player.pos.get("y") - deltaPos);
    } else if (player.move.get("down")){
        player.pos.set("y", player.pos.get("y") + deltaPos);
    }
    
    if (player.pos.get("x") < mapconstraints.left)
        player.pos.set("x", mapconstraints.left);
    if (player.pos.get("x") > mapconstraints.right)
        player.pos.set("x", mapconstraints.right);
    if (player.pos.get("y") < mapconstraints.top)
        player.pos.set("y", mapconstraints.top);
    if (player.pos.get("y") > mapconstraints.bottom)
        player.pos.set("y", mapconstraints.bottom);
}