import SpriteSheet from './SpriteSheet.js';
const socket = io();

socket.on(`helloworld`, (data)=>load(data));

const load = data => {
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

const loadimage = url => {
	return new Promise(resolve=>{
		const image = new Image();
		image.addEventListener(`load`, ()=> resolve(image));
		image.src = url;
	});
}

const main = () => {
	loadimage(`/sprites/backgroundtiles.png`).then(image=>{
		const ctx = document.querySelector(`#main`).getContext(`2d`);
		ctx.imageSmoothingEnabled = false;
		ctx.scale(4,4);
		const sprites = new SpriteSheet(image, 16, 16);
		sprites.define(`ground`, 3, 0);
		for (let x =0; x<25; ++x){
			for (let y=0; y<10; ++y){
				sprites.drawTile(`ground`, ctx, x, y);
			}
		}
		sprites.define(`tree1`, 9, 25);
		sprites.define(`tree2`, 9, 26);
		sprites.define(`tree3`, 9, 27);
		sprites.define(`tree4`, 9, 28);
		sprites.drawTile(`tree1`, ctx, 0, 0);
		sprites.drawTile(`tree2`, ctx, 0, 1);
		sprites.drawTile(`tree3`, ctx, 0, 2);
		sprites.drawTile(`tree4`, ctx, 0, 3);
		sprites.drawTile(`tree1`, ctx, 5, 2);
		sprites.drawTile(`tree2`, ctx, 5, 3);
		sprites.drawTile(`tree3`, ctx, 5, 4);
		sprites.drawTile(`tree4`, ctx, 5, 5);
		sprites.define(`pad1`, 1, 13);
		sprites.define(`pad2`, 2, 13);
		sprites.define(`pad3`, 3, 13);
		sprites.define(`pad4`, 1, 14);
		sprites.define(`pad5`, 2, 14);
		sprites.define(`pad6`, 3, 14);
		sprites.define(`pad7`, 1, 15);
		sprites.define(`pad8`, 2, 15);
		sprites.define(`pad9`, 3, 15);
		sprites.drawTile(`pad1`, ctx, 8, 5);
		sprites.drawTile(`pad2`, ctx, 9, 5);
		sprites.drawTile(`pad3`, ctx, 10, 5);
		sprites.drawTile(`pad4`, ctx, 8, 6);
		sprites.drawTile(`pad5`, ctx, 9, 6);
		sprites.drawTile(`pad6`, ctx, 10, 6);
		sprites.drawTile(`pad7`, ctx, 8, 7);
		sprites.drawTile(`pad8`, ctx, 9, 7);
		sprites.drawTile(`pad9`, ctx, 10, 7);
	});
}