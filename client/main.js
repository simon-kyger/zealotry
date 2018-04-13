const socket = io();

socket.on(`helloworld`, (data)=>{
	console.log(`we're connected.`);
	loginpage();
});

const loginpage = (down) => {
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

socket.on("usercreated", data => {
	document.querySelector('.intermediate').innerHTML = data.msg;
});
socket.on("loginsuccess", data => loadaccountcharacterspage(data));

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

socket.on('createcharsuccess', data=>{
	console.log(data);
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
		width: 800,
		height: 600,
		physics: {},
		pixelArt: true,
		scene: [new Overworld(data)],
	}
	const game = new Phaser.Game(config);
}