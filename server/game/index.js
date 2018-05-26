import * as Server from '../';

const GAME_LOOP_TICK_RATE = 1000/16; //62.5fps target
// Move this into individual map objects
const mapconstraints = {
	left: 0,
	top: 0,
	right:  16000*3 -1920, //mapwidth * scale - canvassize
	bottom: 16000*3 -950 //mapheight * scale - canvassize
}

let gameLoopInterval = 0;

export function beginLoop() {
    gameLoopInterval = setInterval(()=>{
        Server.players.forEach(playerMovement);
    }, GAME_LOOP_TICK_RATE);
}

export function endLoop() {
    clearInterval(gameLoopInterval);
}

function playerMovement(player, delta) {
    if (player.move.left){
        player.pos.x-= player.speed;
    } else if (player.move.right){
        console.log(player.pos.x);
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
}