const socket = io();

socket.on(`helloworld`, (data)=>{
	console.log(`we're connected.`);
	socket.emit('loginreq');
});

const loginpage = (down) => {
	document.body.innerHTML = ``;
	let div = document.createElement("div");
	div.id = 'main';
	div.innerHTML = "";
	div.style.width = `100%`;
	div.style.height = `100%`;
	div.style.color = 'white';
	div.innerHTML = `<main id='login' align='center' class='zdef'>
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
	if (data.realm){
		loadaccountcharacterspage(data);
	} else {
		loadpickrealm(data);
	}
});

const loadpickrealm = data => {
	let div = document.getElementById('main');
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div>Welcome ${data.username}!</div>
						<div>Choose your realm:</div>
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
	});
	
	nopickrealm.addEventListener('click', e=>{
		pick = null;
		intermediate.innerHTML = '';
		pickrealm.style.visibility = nopickrealm.style.visibility = 'hidden';
		realmdescription.innerHTML = '';
	})
	pickrealm.addEventListener('click', e=>{
		socket.emit('realmpick', {realm: pick});
	})
}

const loadaccountcharacterspage = data => {
	let div = document.getElementById('main');
	let chars = '';
	if (data.characters){
		data.characters.forEach(i=> {
			chars+=`<div class='charblock'>
						<button class='btnchar' value='${i.name}'>${i.name} the ${i.class}</button>
					</div>`
		})
	}
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div>Welcome back ${data.username}</div>
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

const createcharacterpage = data => {
	let div = document.getElementById('main');
	div.innerHTML = `<main id='accountcharacters' align='center' class='zdef'>
						<div style='font-size: 50'>Create Character</div>
						<div style='padding-top:50;'>
							<div class='charblock'>
								<button class='btnchar' value='Rogues are sickheads'>Rogue</button>
								<img src='assets/locke/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Knight</button>
								<img src='assets/edgar/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Cleric</button>
								<img src='assets/celes/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Berserker</button>
								<img src='assets/sabin/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Thief</button>
								<img src='assets/setzer/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Ninja</button>
								<img src='assets/shadow/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Warrior</button>
								<img src='assets/leo/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Bard</button>
								<img src='assets/relm/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>White Mage</button>
								<img src='assets/terramonster/0.png' class='imgchar'>
							</div>
							<div class='charblock'>
								<button class='btnchar'>Black Mage</button>
								<img src='assets/kefka/0.png' class='imgchar'>
							</div>
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
		loadaccountcharacterspage(data);
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
	loadaccountcharacterspage(data);
});

socket.on('createcharsuccess', data=>{
	loadaccountcharacterspage(data);
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
		width: 1920,
		height: 950,
		physics: {},
		pixelArt: true,
		scene: [new Overworld(data)],
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