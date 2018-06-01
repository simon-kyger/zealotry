import * as Server from '../';
const PHYS_TICK_RATE = 16; //62.5/s
const UPDATE_TICK_RATE = 50; //20/s



export function start() {
    setInterval(phys, PHYS_TICK_RATE);
    setInterval(update, UPDATE_TICK_RATE);
}

// Move this into individual map objects
const mapconstraints = {
	left: 0,
	top: 0,
	right:  16000*4 -1920, //mapwidth * scale - canvassize
	bottom: 16000*4 -950 //mapheight * scale - canvassize
}

const phys = () => {
    const j = Server.players.length;
    for (let i=0; i<j; ++i){
        const player = Server.players[i];
        const deltaPos = player.speed * 1/PHYS_TICK_RATE;
        if (player.move.get("left")){
            player.pos.set("x", Math.floor(player.pos.get("x") - deltaPos));
        } else if (player.move.get("right")){
            player.pos.set("x", Math.floor(player.pos.get("x") + deltaPos));
        }
        if (player.move.get("up")){
            player.pos.set("y", Math.floor(player.pos.get("y") - deltaPos));
        } else if (player.move.get("down")){
            player.pos.set("y", Math.floor(player.pos.get("y") + deltaPos));
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
}

const update = () => {
    Server.getIo().emit('update', Server.players);
}