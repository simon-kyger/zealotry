const socket = io();

socket.on(`helloworld`, (data)=>{
	console.log(`we're connected.`);
});

const config = {
	type: Phaser.WEBGL,
	width: 800,
	height: 600,
	physics: {},
	pixelArt: true,
	scene: [Overworld]
}

const game = new Phaser.Game(config);