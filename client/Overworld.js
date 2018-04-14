class Overworld extends Phaser.Scene {
    constructor(args){
        super({key: "Overworld"});
        this.player = args.player;
        this.players = args.players;
    }

    preload(){
        this.load.tilemapTiledJSON('map', 'assets/zealotrymap.json');
        this.load.image('backgroundtiles', 'assets/backgroundtiles.png');
        this.load.atlas('players', 'assets/players.png', 'assets/players.json');
    }

    create(){
        this.createanims();
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0);
        this.layer2 = this.map.createStaticLayer('Tile Layer 2', this.tileset, 0, 0);
        
        this.players.forEach(player=>{
            this.createplayer(player);
        })

        //camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
        }
        this.controls = new Phaser.Cameras.Controls.Fixed(this.controlConfig);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels+600, this.map.heightInPixels+300);
        this.input.keyboard.on('keydown', e=>{            
            if (e.key == 'ArrowLeft'){
                socket.emit('move', {dir: 'left', state: true});
            } else if (e.key == 'ArrowRight'){
                socket.emit('move', {dir: 'right', state: true});
            } else if (e.key == 'ArrowUp'){
                socket.emit('move', {dir: 'up', state: true});
            } else if (e.key == 'ArrowDown'){
                socket.emit('move', {dir: 'down', state: true});
            }
        })
        this.input.keyboard.on('keyup', e=>{            
            if (e.key == 'ArrowLeft'){
                socket.emit('move', {dir: 'left', state: false});
            } else if (e.key == 'ArrowRight'){
                socket.emit('move', {dir: 'right', state: false});
            } else if (e.key == 'ArrowUp'){
                socket.emit('move', {dir: 'up', state: false});
            } else if (e.key == 'ArrowDown'){
                socket.emit('move', {dir: 'down', state: false});
            }
        })
        this.input.on('pointerdown', ()=>{
            this.players.forEach(player=>{
                player.sprite.clearTint();
            })
        })
        socket.on('newplayer', data=>{
            this.players.push(data);
            this.createplayer(this.players[this.players.length-1]);
        })
        socket.on('removeplayer', data=>{
            this.players.forEach(player=>{
                if(player.name == data.name){
                    player.sprite.destroy();
                }
            })
            this.players.splice(this.players.indexOf(data), 1);
        });
        socket.on('move', data=> {
            for (let i =0; i<this.players.length; ++i){
                if (this.players[i].name == data.name){
				    this.players[i].class = data.class;
                    this.players[i].pos = data.pos;
                    this.players[i].move = data.move;
				    this.players[i].dir = data.dir;
                    this.players[i].speed = data.speed;
                }
            }
        });
        const mapconstraints = {
            left: 0,
            right: this.map.widthInPixels - 600,
            top: 0,
            bottom: this.map.heightInPixels - 300
        };
        //clientside interpolation loop
        const tickrate = 5;
        setInterval(()=>{
            this.players.forEach(player=>{
                if (player.move.left){
                    player.pos.x-= player.speed/tickrate;
                } else if (player.move.right){
                    player.pos.x+= player.speed/tickrate;
                } 
                if (player.move.up){
                    player.pos.y-= player.speed/tickrate;
                } else if (player.move.down){
                    player.pos.y+= player.speed/tickrate;
                }
                if (player.pos.x < mapconstraints.left)
                    player.pos.x = mapconstraints.left;
                if (player.pos.x > mapconstraints.right)
                    player.pos.x = mapconstraints.right;
                if (player.pos.y < mapconstraints.top)
                    player.pos.y = mapconstraints.top;
                if (player.pos.y > mapconstraints.bottom)
                    player.pos.y = mapconstraints.bottom;
            });
        }, 100/tickrate); //tickrate is how much faster this will be than server tickrate to induce more fluidity or snapping the character to its correct position
    }
    mp(){
        return {
            'Rogue': 'locke',
            'Knight': 'edgar',
            'Cleric': 'celes',
            'Berserker': 'sabin',
            'Thief': 'setzer',
            'Ninja': 'shadow',
            'Warrior': 'leo',
            'Bard': 'relm',
            'White Mage': 'terramonster',
            'Black Mage': 'kefka'
        }
    }
    createanims(){
        Object.keys(this.mp()).forEach(key=>{
            let config = [
                {
                    key: `${key}down`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 0,
                        end: 2,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 8,
                    repeat: -1
                },
                {
                    key: `${key}up`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 3,
                        end: 5,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 8,
                    repeat: -1
                },
                {
                    key: `${key}left`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 6,
                        end: 8,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 8,
                    repeat: -1
                }
            ];
            config.forEach(anim=> this.anims.create(anim));
        })
    }
    createplayer(data){
        data.sprite = this.add.sprite(data.pos.x, data.pos.y, 'players', `${this.mp()[data.class]}/0`).setInteractive();
        data.sprite.on('pointerdown', ()=>{
            data.sprite.setTint(`0xff8888`);
        })
    }

    render(){
        this.players.forEach(player=>{
            if (player.name === this.player.name){
                this.cameras.main.scrollX = player.pos.x;
                this.cameras.main.scrollY = player.pos.y;
            }
            player.sprite.x = player.pos.x + 300;
            player.sprite.y = player.pos.y + 150;
            
            if (player.move.left){
                player.sprite.flipX = false;
                if (player.facing != 'left'){
                    player.sprite.anims.play(`${player.class}left`);
                    player.facing = 'left';
                }
            } else if (player.move.right){
                player.sprite.flipX = true;
                if (player.facing != 'right'){
                    player.sprite.anims.play(`${player.class}left`);
                    player.facing = 'right';
                }
            } else if (player.move.down){
                if (player.facing != 'down'){
                    player.sprite.anims.play(`${player.class}down`);
                    player.facing = 'down';
                }
            } else if (player.move.up){
                if (player.facing != 'up'){
                    player.sprite.anims.play(`${player.class}up`);
                    player.facing = 'up';
                }    
            } else if (!player.move.left && !player.move.right && !player.move.up && !player.move.down){
                if (player.facing != 'idle'){
                    player.facing = 'idle';
                    player.sprite.anims.stop();
                    player.sprite.anims.currentFrame = 0;
                }
            }
        })
    }


    update(timestamp, delta){
        this.render();
    }
}