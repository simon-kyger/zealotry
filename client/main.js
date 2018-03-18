const socket = io();

socket.on('helloworld', (data)=>load(data));

function load(data){
	console.log(data);
	const canvas = document.createElement("canvas");
	document.body.style.margin = 0;
	document.body.style.left = 0;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	window.addEventListener('resize', ()=>{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		draw(canvas);
	});
	draw(canvas);
}

const draw = canvas =>{
	const ctx = canvas.getContext('2d');
	ctx.fillRect(0, 0, 50, 50);
}