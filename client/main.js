const randomtip = () => {
	const tips = [
		`When creating a character, if the img isn't loading, don't pick to test with.`,
		`Want to contribute? <a href='https://github.com/simon-kyger/zealotry' target='_blank' style='color: white'>https://github.com/simon-kyger/zealotry</a>`,
		`The humans were the first realm created in Zealotry`,
	]
	return tips[Math.floor(Math.random()*tips.length)];
}

const socket = io({transports: ['websocket']});

socket.on(`helloworld`, (data)=>{
	console.log(`we're connected.`);
	socket.emit('loginreq');
});

let gameUser;

const loginpage = (down) => {
	document.body.innerHTML = ``;
	let div = document.createElement("div");
	div.id = 'main';
	div.innerHTML = "";
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.style.color = 'white';
	div.innerHTML = `
					<div align='center'>
						<img width='15' height='15' src='data:image/png;base64,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'></img>
						<a target='blank' href="https://github.com/simon-kyger/zealotry">https://github.com/simon-kyger/zealotry</a> 
					</div>	
					<main id='login' align='center' class='zdef'>			
						<div class='tipoftheday'>${randomtip()}</div>
						<div style='font-size: 100'>zealotry.io</div>
						<img src="kefka.gif" style='width:100; height:100'>
						<div style='display: flex;'>
							<div style='flex:1;'></div>
							<form style='font-size: 30; flex:1'>
								<div>
									<input id="username" placeholder="Username"></input>
								</div>
								<div>
									<input id="password" placeholder="Password" type="password"></input>
								</div>
								<div style="padding-top:10">	
									<a id="loginlink" href="#" style='text-decoration: none;'>Login</a>
									<a id="registerlink" href="#" style='text-decoration: none;'>Register</a>
								</div>
								<div class="intermediate" style="padding-top:10">${ down ? `Status: Down for maintenance.` : "Status: Up"}</div>
							</form>
							<div style='flex:1;'></div>
						</div>
					</main>
	`;
	document.body.appendChild(div);
	document.getElementById("password").addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13)
			document.getElementById("loginlink").click();
	});

	//TODO: debounce these
	document.getElementById("loginlink").addEventListener("click", e => {
		e.preventDefault();
		if (socket.connected){
			document.querySelector('.intermediate').innerHTML = 'Connecting to server...';
			const username = document.getElementById("username").value;
			const password = document.getElementById("password").value;
			socket.emit("login", {
				username: username,
				password: password
			});
		}
	})
	document.getElementById("registerlink").addEventListener("click", e => {
		e.preventDefault();
		if (socket.connected){
			document.querySelector('.intermediate').innerHTML = 'Connecting to server...';
			const username = document.getElementById("username").value;
			const password = document.getElementById("password").value;
			socket.emit("register", {
				username: username,
				password: password
			});
		}
	})
}

socket.on(`loginreq`, ()=>{
	document.addEventListener(`DOMContentLoaded`, loginpage(false));
});

socket.on("usercreated", data => {
	document.querySelector('.intermediate').innerHTML = data.msg;
});
socket.on("loginsuccess", data => {
	gameUser = data;
	if (data.realm){
		socket.emit("characterlist", data);
	} else {
		loadpickrealm(data);
	}
});



const loadpickrealm = data => {
	let div = document.getElementById('main');
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div>Welcome ${gameUser.username}!</div>
						<div>Choose your realm:</div>
						<div class='conceptartcontainer' style='position: absolute; opacity: 0.2; z-index:-1;'></div>
						<button class='angelrealm'>Angel</button>
						<button class='humanrealm'>Human</button>
						<button class='demonrealm'>Demon</button>
						<div style='display: flex; padding-top:20px;'>
							<div style='flex: 1;'></div>
							<div class='realmdescription' style='flex: 1; text-align:justify;'></div>
							<div style='flex: 1;'></div>
						</div>
						<div class='intermediate' style='padding-top: 50px'></div>
						<button class='pickrealm' style='margin-top: 20px; width:100px; visibility: hidden;'>Yes</div>
						<button class='nopickrealm' style='width:100px; visibility: hidden;'>No</div>
					</main>
	`;
	const intermediate = document.querySelector('.intermediate');
	const pickrealm = document.querySelector('.pickrealm');
	const nopickrealm = document.querySelector('.nopickrealm');
	const realmdescription = document.querySelector('.realmdescription');
	const conceptartcontainer = document.querySelector('.conceptartcontainer');
	let pick;
	document.querySelector('.angelrealm').addEventListener('click', e=>{
		intermediate.innerHTML = `Are you sure you want to choose Angel? Your account will then be tied to this realm.`;
		pickrealm.style.visibility = nopickrealm.style.visibility = 'visible';
		pick = 'angel';
		realmdescription.innerHTML = `
			Angel: <br> <br>
			The angels have always been a source of what is good and holy within this world of Zealotry. Their ultimate plight is the way of the light, blinding enemies in faith. <br> <br>
			Many of their kind have abilities which enhance regeneration and healing and use these benefits to smite heathens and blasphemers.
		`;
		conceptartcontainer.innerHTML = `
			<img src='/assets/conceptart/${pick}_t.png'>
		`;
	});
	
	document.querySelector('.humanrealm').addEventListener('click', e=>{
		intermediate.innerHTML = `Are you sure you want to choose Human? Your account will then be tied to this realm.`;
		pickrealm.style.visibility = nopickrealm.style.visibility = 'visible';
		pick = 'human';
		realmdescription.innerHTML = `
			Humanity: <br> <br>
			The humans are the cultivators of this land.  They were put here by the gods in front of angels and demons alike to witness. <br> <br>
			Many of their kind revolve around the usage of brute force, heroicism, and rational scientific logic to conquer their enemies.
		`;
		conceptartcontainer.innerHTML = `
			<img src='/assets/conceptart/${pick}_t.png'>
		`;
	});
	
	document.querySelector('.demonrealm').addEventListener('click', e=>{
		intermediate.innerHTML = `Are you sure you want to choose Demon? Your account will then be tied to this realm.`;
		pickrealm.style.visibility = nopickrealm.style.visibility = 'visible';
		pick = 'demon';
		realmdescription.innerHTML = `
			Demon: <br> <br>
			The demons are fallen angels, cast out from the faith due to their insubordination and debauchery.  Demonic use of subtrefuge is a common thing amongst the most vile. <br> <br>
			Many of their kind revolve around the use of a sinful nature, such as stealing the health of their opponents, attacking the minds and perverting the thoughts of the enemies.
		`;
		conceptartcontainer.innerHTML = `
			<img src='/assets/conceptart/${pick}_t.png'>
		`;
	});
	
	nopickrealm.addEventListener('click', e=>{
		pick = null;
		intermediate.innerHTML = '';
		pickrealm.style.visibility = nopickrealm.style.visibility = 'hidden';
		realmdescription.innerHTML = '';
		conceptartcontainer.innerHTML = '';
	})
	pickrealm.addEventListener('click', e=>{
		socket.emit('realmpick', {realm: pick});
	})
}

const loadaccountcharacterspage = data => {
	let div = document.getElementById('main');
	let chars = '';
	if (data){
		data.forEach(i=> {
			chars+=`<div class='charblock'>
						<button class='btnchar' value='${i.name}'>${i.name} the ${i.class}</button>
					</div>`
		})
	}
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div>Welcome back ${gameUser.username}</div>
						<div>Characters:</div>
						${chars}
						<div class='intermediate' style='padding-top: 50px'></div>
						<button class='create'>Create</button>
					</main>
	`;
	document.querySelector('.create').addEventListener('click', e=>{
		createcharacterpage(data);
	});
	document.querySelectorAll('.btnchar').forEach(char=>{
		char.addEventListener('click', e=>{
			document.querySelector('.intermediate').innerHTML = 'Connecting to server...';
			socket.emit('playgame', e.target.value);
		});
	});
}

socket.on("characterlist", data=> {
	loadaccountcharacterspage(data)
});

const createcharacterpage = data => {
	let div = document.getElementById('main');
	let template;
	switch (gameUser.realm){
		case 'angel':
			template = `<div class='charblock'>
							<button class='btnchar'>Paladin</button>
							<img src='assets/playersprites/edgar/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Zealot</button>
							<img src='assets/playersprites/angelshadow/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Seraph</button>
							<img src='undefined' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Archangel</button>
							<img src='assets/playersprites/terramonster/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Spirit</button>
							<img src='undefined' class='imgchar'>
						</div>
			`
			break;
		case 'human':
			template = `<div class='charblock'>
							<button class='btnchar'>Warrior</button>
							<img src='assets/playersprites/leo/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar' value='Rogues are sickheads'>Rogue</button>
							<img src='assets/playersprites/locke/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Bard</button>
							<img src='assets/playersprites/relm/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Engineer</button>
							<img src='assets/playersprites/setzer/0.png' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Doctor</button>
							<img src='assets/playersprites/celes/0.png' class='imgchar'>
						</div>
			`
			break;
		case 'demon':
			template = `
						<div class='charblock'>
							<button class='btnchar'>Skeleton</button>
							<img src='undefined' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Shadow</button>
							<img src='undefined' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Banshee</button>
							<img src='undefined' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Succubus</button>
							<img src='undefined' class='imgchar'>
						</div>
						<div class='charblock'>
							<button class='btnchar'>Ghost</button>
							<img src='assets/playersprites/ghost/0.png' class='imgchar'>
						</div>
			`
			break;
	}
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div style='font-size: 50'>Create Character</div>
						<div style='padding-top:50;'>
							${template}
						</div>
						<div class='intermediate' style='padding-top: 50px'></div>
						<div style='padding-top:50px;'>
							<span>
								<input class="newcharacter" placeholder="Name"></input>
							</span>
							<button class='create'>Create</button>
							<button class='back'>Back</button>
						</div>
					</main>
	`;
	document.querySelectorAll('.btnchar').forEach(char=>{
		char.addEventListener('click', e=>{
			let int = document.querySelector('.intermediate');
			int.value = e.target.innerHTML;
			int.innerHTML = `${e.target.innerHTML}: ${e.target.value}`;
		});
	});
	document.querySelector('.back').addEventListener('click', e=>{
		socket.emit("characterlist", data);
	});
	document.querySelector('.create').addEventListener('click', e=>{
		let int = document.querySelector('.intermediate');
		let charname = document.querySelector('.newcharacter');
		int.innerHTML = 'Creating character...';
		if (int.value && charname.value){
			socket.emit('createchar', {
				class: int.value,
				name: charname.value,
			});
		} else {
			int.innerHTML = 'Select valid character and input valid name.';
			int.value = '';
		}
	});
}

socket.on('realmpick', data=>{
	gameUser = data;
	socket.emit("characterlist", data);
});

socket.on('createcharsuccess', data=>{
	socket.emit("characterlist", data);
});

socket.on('failcreate', data=>{
	document.querySelector('.intermediate').innerHTML = data.msg;
});

socket.on('playgame', data=>{
	document.getElementById('main').parentElement.removeChild(document.getElementById('main'));
	loadgame(data);
});

const loadgame = data => {
	const config = {
		type: Phaser.WEBGL,
		scale: {
			mode: Phaser.Scale.RESIZE,
			width: `1920`,
			height: `1080`,
		},
		physics: {
			default: 'arcade',
			debug: true,
		},
		render:{
			pixelArt: true
		},
		scene: [
			new Overworld(data),
			new Debug_Scene(data),
			new Player_Resources_Scene,
			new Options_Button_Scene,
			new Options_Scene
		]
	}
	const game = new Phaser.Game(config);
}


socket.on('disconnect', ()=>{
	loginpage(true);
	let restart = setInterval(()=>{
		if (socket.connected){
			window.clearInterval(restart);
			setTimeout(()=>{
				location.reload();
			}, 1000);
		}
	}, 1000);
})