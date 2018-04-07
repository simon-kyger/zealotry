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
	div.innerHTML = `<div id='login' align='center' style='padding-top: 100px; font-family: Segoe UI; font-weight: 100; background-color: rgba(0,0,0,.4);box-shadow: 0px 0px 150px 20px rgba(0,0,0,.5)'>
						<div style='font-size: 100'>zealotry.io</div>
						<img src="kefka.gif" style='width:100; height:100'>
						<div style='display: flex;'>
							<div style='flex:1;'></div>
							<form style='font-size: 30; flex:1'>
								<div style="text-shadow: 0px 0px 8px rgba(255,255,255,.8)">
									<input id="username" placeholder="Username" style="height: 40; width: 250; background-color:black; color: white;"></input>
								</div>
								<div style="padding-top:10; text-shadow: 0px 0px 8px rgba(255,255,255,.8)">
									<input id="password" placeholder="Password" type="password" style="height: 40; width: 250; background-color:black; color: white;"></input>
								</div>
								<div>	
									<a id="loginlink" href="#" style='text-decoration: none;'>Login</a>
									<a id="registerlink" href="#" style='text-decoration: none;'>Register</a>
								</div>
								<div id="status">${ down ? `Status: Down for maintenance.` : "Status: Up"}</div>
							</form>
							<div style='flex:1;'></div>
						</div>
					</div>
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
			const username = document.getElementById("username").value;
			const password = document.getElementById("password").value;
			socket.emit("login", {
				username: username,
				password: password
			});
		}
	})
	document.getElementById("registerlink").addEventListener("click", e => {
		if (socket.connected){
			e.preventDefault();
			const username = document.getElementById("username").value;
			const password = document.getElementById("password").value;
			socket.emit("register", {
				username: username,
				password: password
			});
		}
	})
}

socket.on("welcomeheader", data => {
	document.getElementById("loginheadert").innerHTML = data.msg;
});
socket.on("usercreated", data => {
	document.getElementById("status").innerHTML = data.msg;
});
socket.on('badcreds', data=>{
	document.getElementById('status').innerHTML = data.msg;
})
socket.on("loginsuccess", data => loadaccountcharacters(data));

const loadaccountcharacters = data => {
	let div = document.getElementById('main');
	div.innerHTML = `<div>CharacterScreen</div>
	`;
}

const loadgame = data => {
	const config = {
		type: Phaser.WEBGL,
		width: 800,
		height: 600,
		physics: {},
		pixelArt: true,
		scene: [Overworld]
	}

	const game = new Phaser.Game(config);
}