class Overworld extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Overworld", active: true});
        this.player = args.player;
        this.initialplayers = args.players; // doesnt actually work with race conditions, should make a getter on create
        this.gamescale = 4;
        this.fps = 60;
        //debug
        this.showdebug = true;
        //config
        this.shownameplatesboolean = true;
        this.GCD = {
            value: 1000
        }
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
        this.load.tilemapTiledJSON('map', 'assets/zealotrymap.json');
        this.load.json('CFG', 'CFG.json');
    }

    create(){
        this.createanims();
        this.players = this.physics.add.group();
        this.nameplates = {};
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createDynamicLayer('Tile Layer 1', this.tileset, 0, 0)
        this.layer2 = this.map.createDynamicLayer('Tile Layer 2', this.tileset, 0, 0)
        this.layer3 = this.map.createDynamicLayer('Tile Layer 3', this.tileset, 0, 0)
        
        this.createplayer(this.player);
        this.initialplayers.forEach(player=>{
            this.createplayer(player);
        })

        //camera
        this.cameras.main.setZoom(this.gamescale);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            speed: this.player.speed,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            zoomSpeed: 1/this.fps,
        }
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(this.controlConfig);
        this.input.keyboard.on('keyup', e=>{    
            if ([65, 87, 83, 68].includes(e.keyCode)) {       
                socket.emit('stop', {
                    dir: 'idle', 
                    x: this.cameras.main.scrollX, 
                    y: this.cameras.main.scrollY, 
                    messageId: this.messageId++});
                this.player.anims.stop();
            }
            if (e.keyCode == 27){
                this.scene.wake('Options_Scene');
            }
        })
        this.input.keyboard.on('keydown', e=>{
            if ([116].includes(e.keyCode)) return //prevent refresh from being disabled for debug purposes
            e.preventDefault();
            if ([49].includes(e.keyCode) && !this.player.currentqueue){
                if (!this.player.target)
                    return
                this.player.currentqueue = Object.keys(this.player.abilities)[0]
                
                this.GCD.timer = this.time.addEvent({
                    delay: this.GCD.value,
                    callback: ()=>{
                        this.player.currentqueue = '';
                        if (!this.player.target) // required if player switches targets mid cast
                            return
                        socket.emit('ability1', {
                            _id: this.player.target._id,
                            shane: Date.now()
                        });
                    }
                });
            }
        })

        //clears target if you click on nothing
        this.input.on('pointerdown', (p, obj, x, y)=>{
            if (obj.length == 0) this.player.target = null;
        })

        //TODO:
        //the following code breaks everything multiplayer wise (positions get thrown around like crazy)
        //it unfortunately is the right thing to do though so that players with a bigger monitor won't have
        //more of an advantage
        // this.scale.on(`resize`, game =>{	
        //     const {width, height} = game;	
        //     this.cameras.resize(width, height);	
        // })

        socket.on('newplayer', data=>{
            this.createplayer(data);
        })
        socket.on('removeplayer', data=>{
            this.players.getChildren().forEach((player, i)=>{
                if(player._id == data._id){
                    player.destroy();
                }
            })
            for (let key in this.nameplates){
                if (key == data._id){
                    this.nameplates[key].destroy();
                    delete this.nameplates[key];
                }
            }
        });
        socket.on('move', data=> {
            let self = this;
            this.players.getChildren().forEach(player=>{
                if (player._id == this.player._id) return;
                if (player._id == data._id){
                    //update player sprite
                    this.tweens.add({
                        targets: player,
                        x: data.pos.x + this.cameras.main.width/2,
                        y: data.pos.y + this.cameras.main.height/2,
                        duration: 50
                    })
                    player.setDepth(player.y);
                    if (data.dir == 'left'){
                        player.flipX = false;
                        player.anims.play(`${player.class}left`, true);
                    } else if (data.dir == 'right'){
                        player.flipX = true;
                        player.anims.play(`${player.class}left`, true);
                    } else if (data.dir == 'down'){
                        player.anims.play(`${player.class}down`, true);
                    } else if (data.dir == 'up'){
                        player.anims.play(`${player.class}up`, true);
                    } else {
                        player.anims.stop();
                    }
                    //update player nametags
                    this.tweens.add({
                        targets: this.nameplates[player._id],
                        x: data.pos.x + this.cameras.main.width/2 - this.nameplates[player._id].width/2,
                        y: data.pos.y + this.cameras.main.height/2 - this.nameplates[player._id].height*3,
                        duration: 50
                    })
                }
            });
        });
        socket.on('stop', data=> {
            if (this.player._id == data._id) return;
            this.players.getChildren().forEach(player=>{
                if (player._id == data._id){
                    player.x = data.pos.x + this.cameras.main.width/2;
                    player.y = data.pos.y + this.cameras.main.height/2;
                    player.anims.stop();
                }
            });
        });
        socket.on('ability1', data=>{
            const timefromservertoclient = Date.now() - data.shane.timefromservertoclient
            console.log(`time from client to server: ${data.shane.timefromclienttoserver}`)
            console.log(`time from server to client: ${timefromservertoclient}`)
            console.log(`ability1 roundtrip time: ${data.shane.timefromclienttoserver + timefromservertoclient}`)
            if (data._id == this.player._id)
                this.player.currenthp = data.target.currenthp;
            this.players.getChildren().forEach(player=>{
                if (player._id == data.target._id){
                    player.currenthp = data.target.currenthp;
                }
            })
        })
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
                },
                {
                    key: `${key}attack`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 9,
                        end: 10,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 2,
                    repeat: 0
                },
                {
                    key: `${key}idle`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 35,
                        end: 37,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 4,
                    repeat: -1
                }
            ];
            config.forEach(anim=> this.anims.create(anim));
        })
    }
    createplayer(data){
        let sprite = this.physics.add.sprite(
            data.pos.x + this.cameras.main.scrollX, 
            data.pos.y + this.cameras.main.scrollY
            , 'players', 
            `${this.mp()[data.class]}/0`)
        sprite.setInteractive();

        sprite.nametext = this.add.text(data.pos.x, data.pos.y, data.name, {
            font: `6px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setResolution(10);

        sprite.nametext.setVisible(this.shownameplatesboolean);
        
        this.nameplates[data._id] = sprite.nametext;

        if (data._id === this.player._id){
            sprite.fixedToCamera = true;
            this.player = sprite;
        }
        this.players.add(sprite);

        sprite._id = data._id;
        sprite.class = data.class;
        sprite.speed = data.speed;
        sprite.currenthp = data.currenthp;
        sprite.maxhp = data.maxhp;
        sprite.currentend = data.currentend;
        sprite.maxend = data.maxend;
        sprite.currentmana = data.currentmana;
        sprite.maxmana = data.maxmana;
        sprite.name = data.name;
        sprite.abilities = data.abilities;
        sprite.on('pointerdown', ()=>{
            this.player.target = sprite;
        })
    }

    mapconstraints() {
        return {
            left: 0,
            right: this.map.widthInPixels*this.gamescale -this.cameras.main.width,
            top: 0,
            bottom: this.map.heightInPixels*this.gamescale -this.cameras.main.height
        }
    }

    phys(delta){
        this.player.body.setVelocity(0);
        this.controls.update(delta);
        this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 1, 10))
        if (this.controls.left.isDown){
            this.player.body.setVelocityX(-this.player.speed*delta)
            this.player.dir = 'left';
        } else if (this.controls.right.isDown){
            this.player.body.setVelocityX(this.player.speed*delta)
            this.player.dir = 'right'
        }
        if (this.controls.down.isDown){
            this.player.dir = 'down'
            this.player.body.setVelocityY(this.player.speed*delta)
        } else if (this.controls.up.isDown){
            this.player.dir = 'up'
            this.player.body.setVelocityY(-this.player.speed*delta)
        }
    }

    renderplayer(){
        //update animations

        if (this.player.currentqueue){
            this.player.play(`${this.player.class}attack`,true);
        } else if (this.controls.left.isDown){
            this.player.flipX = false;
            this.player.anims.play(`${this.player.class}left`,true);
        } else if (this.controls.right.isDown){
            this.player.flipX = true;
            this.player.anims.play(`${this.player.class}left`,true);
        } else if (this.controls.down.isDown){
            this.player.anims.play(`${this.player.class}down`,true);
        } else if (this.controls.up.isDown){
            this.player.anims.play(`${this.player.class}up`,true);
        } else {
            this.player.anims.stop()
        }
        this.player.setDepth(this.player.y);
        this.nameplates[this.player._id].x = this.player.x - this.nameplates[this.player._id].width/2,
        this.nameplates[this.player._id].y = this.player.y - this.nameplates[this.player._id].height*3
    }

    renderdebug(){
        this.events.emit('debug', {
            player: this.player,
            cameras: this.cameras,
        })
    }
    renderui(){
        this.events.emit('updateresources', {
            currenthp: this.player.currenthp,
            maxhp: this.player.maxhp,
            currentend: this.player.currentend,
            maxend: this.player.maxend,
            currentmana: this.player.currentmana,
            maxmana: this.player.maxmana,
            target: this.player.target ? this.player.target : null
        })
        this.events.emit('updateabilities',{
            gcd: this.GCD.timer ? Math.floor(this.GCD.timer.getProgress() * 1000) : 1000, //it starts in sub 1 levels 
            value: this.GCD.value
        })
    }

    render(){
        this.renderdebug();
        this.renderplayer();
        this.renderui();
    }

    net(){
        if (this.controls.left.isDown || this.controls.right.isDown || this.controls.down.isDown || this.controls.up.isDown){
            socket.emit('move', {
                dir: this.player.dir, 
                state: true, 
                x: this.cameras.main.scrollX, 
                y: this.cameras.main.scrollY, 
                messageId: this.messageId++
            });
        }
    }

    update(time, delta){
        if (this.scene.isActive('Options_Scene')) return;
        this.phys(delta)
        this.render();
        this.net();
    }
}