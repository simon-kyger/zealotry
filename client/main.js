import {loadimage, loadjson} from './loaders.js';
import {render} from './render.js';
const socket = io();

socket.on(`helloworld`, (data)=>init(data));

const init = data => {
	console.log(data);
	const canvas = document.createElement(`canvas`);
	document.body.style.margin = 0;
	document.body.style.left = 0;
	document.body.style.backgroundColor = `black`;
	canvas.id = `main`;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	window.addEventListener(`resize`, ()=>{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		main();
	});
	main();
}

const main = async() => {
	//load images
	const backgroundSpritesheet = await loadimage(`/sprites/backgroundtiles.png`);
	const playerSpritesheet = await loadimage(`/sprites/players.gif`);
	//load data
	const {backgrounds:backgrounds, foregrounds:foregrounds} = await loadjson(`testmap`);
	const {players:players} = await loadjson(`players`);
	//construct rendering
	const ctx = document.querySelector(`#main`).getContext(`2d`);
	ctx.imageSmoothingEnabled = false;
	ctx.scale(4,4);
	await render(ctx, backgroundSpritesheet, backgrounds);
	await render(ctx, playerSpritesheet, players);
	await render(ctx, backgroundSpritesheet, foregrounds);
}
