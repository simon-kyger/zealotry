import SpriteSheet from './SpriteSheet.js';
import {loadimage, loadmap} from './loaders.js';
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

const drawbackground = (background, ctx, sprites) => {
	background.ranges.forEach(([x1, x2, y1, y2])=>{
		for (let x = x1; x < x2; ++x){
			for(let y = y1; y < y2; ++y){
				sprites.drawTile(background.tile, ctx, x, y);
			}			
		}
	});
}

const main = async() => {
	const image = await loadimage(`/sprites/backgroundtiles.png`);
	const ctx = document.querySelector(`#main`).getContext(`2d`);
	ctx.imageSmoothingEnabled = false;
	ctx.scale(4,4);
	const sprites = new SpriteSheet(image, 16, 16);
	sprites.define(`grass1`, 3, 0);
	sprites.define(`tree1`, 9, 25);
	sprites.define(`tree2`, 9, 26);
	sprites.define(`tree3`, 9, 27);
	sprites.define(`tree4`, 9, 28);
	const map = await loadmap(`test`);
	map.backgrounds.forEach(background=>drawbackground(background, ctx, sprites));
}