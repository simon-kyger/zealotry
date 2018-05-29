class Overworld extends Phaser.Scene {

    

    constructor(args){
        //setup and variable initializations
        super({key: "Overworld"});
        this.player = args.player;
        this.players = args.players;
        this.scale = 4;

        //framelocking;
        this.lag = 0;
        this.fps = 62.5;
        this.frameduration = 1000 / this.fps;

        this.deltaTime = 1/62.5;
        this.lastTime = 0;
        this.accumulatedTime = 0;
    }

    preload(){
        this.loadscreen();
        this.load.image('backgroundtiles', 'assets/backgroundtiles.png');
        this.load.atlas('players', 'assets/players.png', 'assets/players.json');
        this.load.image('shadows', 'assets/shadows/0.png');
        this.load.tilemapTiledJSON('map', 'assets/zealotrymap.json');
    }

    loadscreen(){
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '40px Segoe UI',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '20px Segoe UI',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '20px Segoe UI',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', v=> {
            percentText.setText(parseInt(v * 100) + '%');
        });
        
        this.load.on('fileprogress', file=> {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create(){
        this.createanims();
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0).setScale(this.scale);
        this.layer2 = this.map.createStaticLayer('Tile Layer 2', this.tileset, 0, 0).setScale(this.scale);
        this.layer3 = this.map.createStaticLayer('Tile Layer 3', this.tileset, 0, 0).setScale(this.scale);
        
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
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels*this.scale, this.map.heightInPixels*this.scale);
        this.cameras.main.scrollX = this.player.pos.x;
        this.cameras.main.scrollY = this.player.pos.y;
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
            this.players.forEach((player, i)=>{
                if(player.name == data.name){
                    player.sprite.destroy();
                    player.sprite.shadows.destroy();
                    player.sprite.name.destroy();
                    this.players.splice(i, 1);
                }
            })
        });
        socket.on('move', data=> {
            for (let i =0; i<this.players.length; ++i){
                if (this.players[i].name == data.name){
                    let temp = this.players[i].sprite;
                    this.players[i] = data;
                    this.players[i].sprite = temp;
                    break;
                }
            }
        });
    }
    mp(){
        //TODO
        return {
            'Paladin': 'edgar',
            //'Zealot': ??,
            //'Seraph': ??,
            'Archangel': 'terramonster',
            //'Spirit': ??,
            'Warrior': 'leo',
            'Rogue': 'locke',
            'Bard': 'relm',
            'Wizard': 'setzer',
            'Cleric': 'celes',
            //'Skeleton': ??,
            //'Shadow': ??,
            //'Prophet': ??,
            //'Succubus': ??,
            'Ghost': 'ghost'
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
                    repeat: -1,
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
        data.sprite = this.add.sprite(data.pos.x, data.pos.y, 'players', `${this.mp()[data.class]}/0`).setInteractive().setScale(this.scale);
        data.sprite.shadows = this.add.sprite(data.pos.x, data.pos.y, 'shadows').setScale(this.scale);
        data.sprite.name = this.make.text({
            x: data.pos.x,
            y: data.pos.y,
            text: data.name,
            style: {
                font: '20px Lucida Console',
                fill: '#dddddd',
            }
        });
        data.sprite.name.setShadow(2, 2, 'rgba(0,0,0,1', 0);
        data.sprite.on('pointerdown', ()=>{
            data.sprite.setTint(`0xff8888`);
        })
    }

    mapconstraints() {
        return {
            left: 0,
            right: this.map.widthInPixels*this.scale -this.cameras.main.width,
            top: 0,
            bottom: this.map.heightInPixels*this.scale -this.cameras.main.height
        }
    }

    render(){
        const j = this.players.length;
        for (let i=0; i<j; ++i){
            const player = this.players[i];
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
                }
            }
            if (player.name === this.player.name){
                this.tweens.add({
                    targets: this.cameras.main,
                    scrollX: Math.floor(player.pos.x),
                    scrollY: Math.floor(player.pos.y),
                    duration: 64,
                    ease: 'Sine.easeIn'
                });
            }
            this.tweens.add({
                targets: [player.sprite],
                x: player.pos.x + this.cameras.main.width/2,
                y: player.pos.y + this.cameras.main.height/2,
                duration: 30,
                ease: 'Sine.easeIn'
            })
            this.tweens.add({
                targets: player.sprite.name,
                x: player.pos.x + this.cameras.main.width/2 - player.sprite.name.width/2,
                y: player.pos.y + this.cameras.main.height/2 - player.sprite.height*this.scale,
                duration: 30,
                ease: 'Sine.easeIn'
            })
            this.tweens.add({
                targets: player.sprite.shadows,
                x: player.pos.x + this.cameras.main.width/2,
                y: player.pos.y + this.cameras.main.height/2 + player.sprite.height*this.scale - 4,
                duration: 32,
                ease: 'Sine.easeIn'
            })
            player.sprite.depth = player.pos.y;
        }
    }

    phys(delta){
        const j = this.players.length;
        for (let i=0; i<j; ++i){
            const player = this.players[i];
            const deltaPos = player.speed * this.deltaTime * this.frameduration;
            if (player.move.left){
                player.pos.x-= deltaPos;
            } else if (player.move.right){
                player.pos.x+= deltaPos;
            } 
            if (player.move.up){
                player.pos.y-= deltaPos;
            } else if (player.move.down){
                player.pos.y+= deltaPos;
            }
            if (player.pos.x < this.mapconstraints().left)
                player.pos.x = this.mapconstraints().left;
            if (player.pos.x > this.mapconstraints().right)
                player.pos.x = this.mapconstraints().right;
            if (player.pos.y < this.mapconstraints().top)
                player.pos.y = this.mapconstraints().top;
            if (player.pos.y > this.mapconstraints().bottom)
                player.pos.y = this.mapconstraints().bottom; 
        }
    }

    update(time, elapsed){
        this.accumulatedTime += (time - this.lastTime)/1000;
        while (this.accumulatedTime > this.deltaTime) {
            this.phys(time);            
            this.accumulatedTime -= this.deltaTime;
        }
        this.render(elapsed);
        this.lastTime = time;
    }
}