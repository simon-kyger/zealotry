import {loadimage, loadmap} from './loaders.js';
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
const delay = () => new Promise(resolve=> setTimeout(resolve, 100));

const main = async() => {
	const image = await loadimage(`/sprites/backgroundtiles.png`);
	const ctx = document.querySelector(`#main`).getContext(`2d`);
	ctx.imageSmoothingEnabled = false;
	ctx.scale(4,4);
	const {backgrounds:backgrounds} = await loadmap(`test`);
	render(ctx, image, backgrounds);
}
