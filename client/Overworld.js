class Overworld extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Overworld"});
        this.player = args.player;
        this.initialplayers = args.players; // doesnt actually work with race conditions, should make a getter on create
        this.gamescale = 3;
        
        //main loop vars
        this.fps = 60;
        this.interval = 1000 / this.fps;
        this.then = Date.now();
        this.now;
        this.delta;
        this.messageId = 0;

        //debug
        this.showdebug = true;
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

    preload(){
        this.loadscreen();
        this.load.image('backgroundtiles', 'assets/backgroundtiles_extruded.png');
        this.load.atlas('players', 'assets/players.png', 'assets/players.json');
        this.load.image('shadows', 'assets/playersprites/shadows/0.png');
        this.load.tilemapTiledJSON('map', 'assets/zealotrymap.json');
    }

    create(){
        this.createanims();
        this.players = this.physics.add.group();
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0)
        this.layer2 = this.map.createStaticLayer('Tile Layer 2', this.tileset, 0, 0)
        this.layer3 = this.map.createStaticLayer('Tile Layer 3', this.tileset, 0, 0)
        
        this.createplayer(this.player);
        this.initialplayers.forEach(player=>{
            this.createplayer(player);
        })

        //camera
        //this.cameras.main.setZoom(this.gamescale);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: this.player.speed,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        }
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(this.controlConfig);
        this.input.keyboard.on('keyup', e=>{    
            if (e.keyCode >= 37 && e.keyCode <= 40) {        
                socket.emit('stop', {dir: 'idle', x: this.cameras.main.scrollX, y: this.cameras.main.scrollY, messageId: this.messageId++});
                this.player.sprite.anims.stop();
                this.player.sprite.anims.currentFrame = 0;
                this.player.facing = 'idle';
            }
        })
        socket.on('newplayer', data=>{
            this.createplayer(data);
        })
        socket.on('removeplayer', data=>{
            this.players.getChildren().forEach((player, i)=>{
                if(player.name == data.name){
                    player.sprite.destroy();
                    player.sprite.shadows.destroy();
                    player.sprite.name.destroy();
                    player.destroy();
                }
            })
        });
        socket.on('move', data=> {
            let self = this;
            this.players.getChildren().forEach(player=>{
                if (player.name.text == data.name){ //TO DO THIS IS AWFUL LOL
                    //player.setPosition(data.pos.x+self.cameras.main.width/2, data.pos.y+self.cameras.main.height/2);
                    player.x = data.pos.x + self.cameras.main.width/2;
                    player.y = data.pos.y + self.cameras.main.height/2;
                    if (data.dir == 'left'){
                        player.flipX = false;
                        if (player.facing != 'left'){
                            player.play(`${player.class}left`);
                            player.facing = 'left';
                        }
                    } else if (data.dir == 'right'){
                        player.flipX = true;
                        if (player.facing != 'right'){
                            player.play(`${player.class}left`);
                            player.facing = 'right';
                        }
                    } else if (data.dir == 'down'){
                        if (player.facing != 'down'){
                            player.play(`${player.class}down`);
                            player.facing = 'down';
                        }
                    } else if (data.dir == 'up'){
                        if (player.facing != 'up'){
                            player.play(`${player.class}up`);
                            player.facing = 'up';
                        }
                    } 
                }
            });
        });
        socket.on('stop', data=> {
            let self = this;
            this.players.getChildren().forEach(player=>{
                if (player.name.text == data.name){ //TO DO THIS IS AWFUL LOL
                    player.x = data.pos.x + self.cameras.main.width/2;
                    player.y = data.pos.y + self.cameras.main.height/2;
                    player.anims.stop();
                    player.facing = 'idle';
                }
            });
        });
        //DEBUG TEXT
        if (this.showdebug){ 
            this.debugtext = this.add.text(0, 0, '', { 
                font: '20px Courier', 
                fill: '#ff0000', 
                backgroundColor: 'rgba(0, 0, 0, .6)' }, 
                this.debuggroup).setDepth(1).setScrollFactor(0);
        }
    }
    mp(){
        //TODO
        return {
            'Paladin': 'edgar',
            'Zealot': 'angelshadow',
            //'Seraph': ??,
            'Archangel': 'terramonster',
            //'Spirit': ??,
            'Warrior': 'leo',
            'Rogue': 'locke',
            'Bard': 'relm',
            'Engineer': 'setzer',
            'Doctor': 'celes',
            //'Skeleton': ??,
            //'Shadow': ??,
            //'Banshee': ??,
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
        data.sprite = this.physics.add.sprite(data.pos.x+this.cameras.main.width/2, data.pos.y+this.cameras.main.height/2, 'players', `${this.mp()[data.class]}/0`).setInteractive();
        if (data.name === this.player.name){
            this.player.sprite = data.sprite;
            this.player.sprite.x = this.cameras.main.width/2;
            this.player.sprite.y = this.cameras.main.height/2;
            this.player.sprite.setScrollFactor(0);
            this.player.sprite.fixedToCamera = true;
        } else {
            this.players.add(data.sprite);
            data.sprite.class = data.class;
            data.sprite.speed = data.speed;
        }
    }

    mapconstraints() {
        return {
            left: 0,
            right: this.map.widthInPixels*this.gamescale -this.cameras.main.width,
            top: 0,
            bottom: this.map.heightInPixels*this.gamescale -this.cameras.main.height
        }
    }

    displaydebug() {
        let template = `
----------------------------DEBUG-----------------------------
this.players[0] {
    x: ${this.players.getChildren()[0] ? this.players.getChildren()[0].x : null}  
    y: ${this.players.getChildren()[0] ? this.players.getChildren()[0].y : null}  
}
Camera {
    scrollX: ${this.cameras.main.scrollX}
    scrollY: ${this.cameras.main.scrollY}
}
Tweens {
    active: ${this.tweens._active.length}
}
        `;
        this.debugtext.setText(template);
    }

    update(time, delta){
        this.showdebug ? this.displaydebug() : null;
        this.player.sprite.body.setVelocity(0);
        this.controls.update(delta);
        if (this.cursors.left.isDown){
            this.player.sprite.body.setVelocityX(-64)
            this.player.pos.x = this.player.sprite.x;
            socket.emit('move', {dir: 'left', state: true, x: this.cameras.main.scrollX, y: this.cameras.main.scrollY, messageId: this.messageId++});
        } else if (this.cursors.right.isDown){
            this.player.sprite.body.setVelocityX(64)
            this.player.pos.x = this.player.sprite.x;
            socket.emit('move', {dir: 'right', state: true, x: this.cameras.main.scrollX, y: this.cameras.main.scrollY, messageId: this.messageId++});
        }
        if (this.cursors.down.isDown){
            this.player.sprite.body.setVelocityY(64)
            this.player.pos.y = this.player.sprite.y;
            socket.emit('move', {dir: 'down', state: true, x: this.cameras.main.scrollX, y: this.cameras.main.scrollY, messageId: this.messageId++});
        } else if (this.cursors.up.isDown){
            this.player.sprite.body.setVelocityY(-64)
            this.player.pos.y = this.player.sprite.y;
            socket.emit('move', {dir: 'up', state: true, x: this.cameras.main.scrollX, y: this.cameras.main.scrollY, messageId: this.messageId++});
        }
        //update animations
        if (this.cursors.left.isDown){
            this.player.sprite.flipX = false;
            this.player.sprite.anims.play(`${this.player.class}left`);
            this.player.facing = 'left';
        } else if (this.cursors.right.isDown){
            this.player.sprite.flipX = true;
            this.player.sprite.anims.play(`${this.player.class}left`);
            this.player.facing = 'right';
        } else if (this.cursors.down.isDown){
            this.player.sprite.anims.play(`${this.player.class}down`);
            this.player.facing = 'down';
        } else if (this.cursors.up.isDown){
            this.player.sprite.anims.play(`${this.player.class}up`);
            this.player.facing = 'up';
        } else {
            this.player.sprite.anims.stop();
        }
    }
}