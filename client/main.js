const socket = io();

socket.on(`helloworld`, (data)=>{
	console.log(`we're connected.`);
});

socket.on(`pingers`, data=>{
	console.log(data);
})
socket.emit('pingers');

const config = {
	type: Phaser.WEBGL,
	width: 800,
	height: 600,
	physics: {},
	pixelArt: true,
	scene: [Overworld]
}

const game = new Phaser.Game(config);