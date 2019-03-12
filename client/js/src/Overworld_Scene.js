export default class Overworld_Scene extends Phaser.Scene {
    constructor(args, socket, allAbilities){
        //setup and variable initializations
        super({key: "Overworld_Scene", active: true});
        this.player = args.player;
        this.initialplayers = args.players; // doesnt actually work with race conditions, should make a getter on create
        this.gamescale = 4;
        //debug
        this.showdebug = true;
        //config
        this.shownameplatesboolean = true;
        this.socket = socket;
        this.GCD = {
            timer: null,
            value: 1000
        }
        this.allAbilities = allAbilities;
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
        this.setcontrols(this.cache.json.get('CFG').controls);
        this.createkeylisteners(this.KEYBOARD);

        //TODO:
        //the following code breaks everything multiplayer wise (positions get thrown around like crazy)
        //it unfortunately is the right thing to do though so that players with a bigger monitor won't have
        //more of an advantage
        // this.scale.on(`resize`, game =>{	
        //     const {width, height} = game;	
        //     this.cameras.resize(width, height);	
        // })

        this.socket.on('newplayer', data=>{
            this.createplayer(data);
        })
        this.socket.on('removeplayer', data=>{
            this.players.getChildren().forEach((player, i)=>{
                if(player._id == data._id){
                    player.destroy();
                }
                if (this.player.target && (this.player.target._id == player._id)){
                    this.player.target = null;
                    this.player.stickid = null;
                }
            })
            for (let key in this.nameplates){
                if (key == data._id){
                    this.nameplates[key].destroy();
                    delete this.nameplates[key];
                }
            }
        });
        this.socket.on('move', data=> {
            this.players.getChildren().forEach(player=>{
                if (player._id == data._id){
                    //override its current x and y positions (in case of lags)
                    player.x = data.x
                    player.y = data.y
                    //update physics
                    if (data.velocity.x > 0){
                        player.setVelocityX(player.speed)
                    } else if (data.velocity.x < 0){
                        player.setVelocityX(-player.speed)
                    } else {
                        player.setVelocityX(0)
                    }
                    if (data.velocity.y > 0){
                        player.setVelocityY(player.speed)
                    } else if (data.velocity.y < 0){
                        player.setVelocityY(-player.speed)
                    } else {
                        player.setVelocityY(0)
                    }

                    //update animations
                    player.setDepth(player.y);
                    if (data.velocity.x < 0){
                        player.flipX = false;
                        player.anims.play(`${player.class}left`, true);
                    } else if (data.velocity.x > 0){
                        player.flipX = true;
                        player.anims.play(`${player.class}left`, true);
                    } else if (data.velocity.y > 0){
                        player.anims.play(`${player.class}down`, true);
                    } else if (data.velocity.y < 0){
                        player.anims.play(`${player.class}up`, true);
                    } else {
                        player.anims.stop();
                    }
                    
                }
            });
        });
        this.socket.on('queueattack', data=>{
            this.players.getChildren().forEach(player=>{
                if(player._id == data){
                    player.play(`${player.class}attack`, true);
                }
            })
        })
        this.socket.on('outofrange', data=>{
            if (data.attacker._id == this.player._id){
                this.player.anims.play(`${this.player.class}stand`, true)
                return;
            }
            this.players.getChildren().forEach(player=>{
                if (data.attacker._id == player._id){
                    player.anims.play(`${player.class}stand`, true)
                    return;
                }
            })
        })
        this.socket.on('ability1', data=>{
            if (data.target._id == this.player._id){
                this.player.currenthp = data.target.currenthp;
                this.player.hurt = true;
                this.time.addEvent({
                    delay: 500,
                    callback: ()=>{
                        this.player.hurt = false;
                        this.player.anims.play(`${this.player.class}stand`, true)
                    }
                });
            }
            if (data.attacker._id == this.player._id){
                this.player.anims.play(`${this.player.class}stand`, true)
            }
            this.players.getChildren().forEach(player=>{
                if (player._id == data.target._id){
                    player.currenthp = data.target.currenthp;
                    player.play(`${player.class}hurt`, true);
                    player.hurt = true;
                    this.time.addEvent({
                        delay: 500,
                        callback: ()=>{
                            player.hurt = false;
                            player.anims.play(`${player.class}stand`, true)
                        }
                    });
                }
                if (data.attacker._id == player._id){
                    player.anims.play(`${player.class}stand`, true)
                }
            })
        })
    }
    /**
     *  
     * Creates Listeners for all key and mouse input for the game
     * Also sanitizes input before passing it off to be handled by handlegamekey();
     * @param {Object} keyboard Keyboard object which is currently mapped from CFG json. 
     */
    createkeylisteners(keyboard){
        this.input.keyboard.on('keydown', e=>{
            //prevent f5 and f12 from being disabled for debug purposes
            if ([116,123].includes(e.keyCode)) 
                return 
            
            //prevent usual behavior
            e.preventDefault();
            
            //is this a key we care about.  if it is assign the keyboard state, otherwise gtfo
            let ret = true;
            let gamekey;
            for (let key in keyboard){
                if (keyboard[key].keyCode == e.keyCode){
                    keyboard[key].state = true;
                    gamekey = key;
                    ret = false;
                }
            }
            if (ret) return;

            this.handlegamekey(gamekey, true);
        })
        this.input.keyboard.on('keyup', e=>{
            //prevent f5 and f12 from being disabled for debug purposes
            if ([116,123].includes(e.keyCode)) 
                return 
            
            //prevent usual behavior
            e.preventDefault();
            
            //is this a key we care about.  if it is assign the keyboard state, otherwise gtfo
            let ret = true;
            let gamekey;
            for (let key in this.KEYBOARD){
                if (keyboard[key].keyCode == e.keyCode){
                    keyboard[key].state = false;
                    gamekey = key;
                    ret = false;
                }
            }
            if (ret) return;
            
            this.handlegamekey(gamekey, false);
        })

        //clears target if you click on nothing
        this.input.on('pointerdown', (p, obj, x, y)=>{
            if (obj.length == 0) this.player.target = null;
        })
    }
    /**
     * Handles all key down or key up presses of "game" keys.  This has already been sanitized
     * of other keys nonrelevant to the game.  See createkeylisteners() for all keys before santization.
     * @param {String} key a "game only" key that has been issued either up or down
     * @param {Boolean} val true is the button is pressed, false the button is released
     */
    handlegamekey(key, val){
        if (key == 'ability1' && val && !this.player.currentqueue){
            if (!this.player.target)
                return
            const rangecheck = this.allAbilities(this.player.abilities[0]).rangecheck(this.player, this.player.target);
            if (rangecheck){
                this.socket.emit('queueattack', {
                    target_id: this.player.target._id,
                    x: this.player.x,
                    y: this.player.y
                })
                this.player.currentqueue = key;
                this.GCD.timer = this.time.addEvent({
                    delay: this.allAbilities(this.player.abilities[0]).speed,
                    callback: ()=>{
                        this.player.currentqueue = '';
                        if (!this.player.target) // required if player switches targets mid cast
                            return
                        const secondcheck = this.allAbilities(this.player.abilities[0]).rangecheck(this.player, this.player.target);
                        if (secondcheck) {
                            this.socket.emit('ability1', {
                                target_id: this.player.target._id,
                                x: this.player.x,
                                y: this.player.y
                            });
                        }
                    }
                });
            }
        }

        //on movement, we dont care if the key was up or down, the update loop will handle setting
        //the vector .velocity to the correct direction to send to the server.
        if ((key == 'up') || (key =='down') || (key == 'left') || (key == 'right')){
            this.player.stickid = null;
            this.follow(null);
            this.player.body.setVelocity(0)
            if (this.KEYBOARD.up.isDown) this.player.body.velocity.y = -this.player.speed;
            else if (this.KEYBOARD.down.isDown) this.player.body.velocity.y = this.player.speed;
            if (this.KEYBOARD.left.isDown) this.player.body.velocity.x = -this.player.speed;
            else if (this.KEYBOARD.right.isDown) this.player.body.velocity.x = this.player.speed;
            this.socket.emit(`move`, {
                velocity: this.player.body.velocity,
                x: this.player.x,
                y: this.player.y,
            })
        }

        if (key == 'toggleconfig' && !val)
            this.scene.wake('Options_Scene')
        if (key == 'stick' && val && this.player.target && (this.player.target._id != this.player._id)){
            this.player.stickid = this.player.target._id;
            this.players.getChildren().forEach(player=>{
                if (player._id == this.player.stickid){
                    this.follow(player);
                }
            })
        }
    }

    /**
     * Makes the local player follow the player arg passed in
     * Threshold is set by this.player.stickdistance which is set in the CFG / key controls
     * Also communicates to the server on an interval of every 500ms to update movement
     * for other players to see this player is following someone
     * @param {Arcade Sprite Object} player 
     */
    follow(player){
        if (this.followtimer)
            this.followtimer.remove(false);
        if (!player){
            this.player.body.stop();
            return;
        }
        
        this.physics.moveToObject(this.player, player, this.player.speed)
        let toggle = true;
        this.followtimer = this.time.addEvent({
            callbackScope: this,
            delay: 500,
            loop: true,
            callback: ()=>{
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, player.x, player.y)
                if (dist < this.player.stickdistance){
                    this.player.body.stop()  
                    toggle = false;
                    this.socket.emit('move', {
                        velocity: this.player.body.velocity,
                        x: this.player.x,
                        y: this.player.y        
                    })
                } else if (dist > this.player.stickdistance){
                    this.physics.moveTo(
                        this.player, 
                        player.x, 
                        player.y, 
                        this.player.speed
                    ) //TODO FIX INTERPOLATION
                    toggle = true;
                }
                //if (this.player.body.isMoving)
                //doesn't work ... moveToObject doesnt update isMoving boolean
                //I made a post about it here: https://phaser.discourse.group/t/physics-body-ismoving-doesnt-get-update-from-movetoobject/1426
                if (toggle){
                    this.socket.emit('move', {
                        velocity: this.player.body.velocity,
                        x: this.player.x,
                        y: this.player.y        
                    })
                }
            },
        })
    }
    /**
     * Sets all the controls based upon a structure passed and can modify them at runtime
     * @param {Object} controls 
     *                          
     */
    setcontrols(controls){
        this.KEYBOARD = {
            ability1: this.input.keyboard.addKey(controls.ability1.keyCode),
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(controls.left.keyCode),
            right: this.input.keyboard.addKey(controls.right.keyCode),
            up: this.input.keyboard.addKey(controls.up.keyCode),
            down: this.input.keyboard.addKey(controls.down.keyCode),
            stick: this.input.keyboard.addKey(controls.stick.keyCode),
            toggleconfig: this.input.keyboard.addKey(controls.toggleconfig.keyCode),
            //TODO: these should be taken out if player is not a GM
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            zoomSpeed: controls.zoom.speed,
        }
        this.player.stickdistance = controls.stick.distance;
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(this.KEYBOARD);
    }
    /**
     * A hash lookup for relating classes to sprite names (the names originally were)
     * ff6 sprites, but in this game, they have different names the game will refer
     * to them by.
     */
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
    /**
     * Creates every animation type for every key value pair in the mapping via this.mp()
     */
    createanims(){
        Object.keys(this.mp()).forEach(key=>{
            let config = [
                {
                    key: `${key}stand`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 1,
                        end: 1,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 8,
                    repeat: -1
                },
                {
                    key: `${key}down`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 0,
                        end: 2,
                        frames: [1,2,1,0],
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
                        frames: [4,5,4,3],
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
                        frames: [7,8,7,6],
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
                        frames: [36,37,36,35],
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 4,
                    repeat: -1
                },
                {
                    key: `${key}hurt`,
                    frames: this.anims.generateFrameNames('players', {
                        start: 11,
                        end: 11,
                        prefix: `${this.mp()[key]}/`
                    }),
                    frameRate: 4,
                    repeat: 0
                },
            ];
            config.forEach(anim=> this.anims.create(anim));
        })
    }
    /**
     * Creates a player sprite, agnostic if it is the local player, or foreign.
     * @param {Object} data Player data
     */
    createplayer(data){
        let sprite = this.physics.add.sprite(
            data.x, 
            data.y, 
            'players', 
            `${this.mp()[data.class]}/0`)
        sprite.setInteractive();

        sprite.nametext = this.add.text(data.x, data.y, data.name, {
            font: `6px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setResolution(10);

        sprite.nametext.setVisible(this.shownameplatesboolean);
        
        this.nameplates[data._id] = sprite.nametext;

        if (data._id === this.player._id){
            sprite.fixedToCamera = true;
            this.player = sprite;
        } else {
            this.players.add(sprite);
        }
        for (let k in data){
            sprite[k] = data[k]
        }
        sprite.on('pointerdown', ()=>{
            this.player.target = sprite;
        })
    }
    /**
     * The physics being handled upon both the local player and their camera
     * @param {Float} delta The multiplier to normalize all vector based movements
     */
    phys(){
        this.controls.update();
        this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 1, 10))
        
        this.players.getChildren().forEach(player=>{
            this.nameplates[player._id].x = player.x - this.nameplates[player._id].width/2,
            this.nameplates[player._id].y = player.y - this.nameplates[player._id].height*3
        })
        this.nameplates[this.player._id].x = this.player.x - this.nameplates[this.player._id].width/2,
        this.nameplates[this.player._id].y = this.player.y - this.nameplates[this.player._id].height*3
    }
    /**
     * Rendering queue of the local player and their respective nameplate.
     * Ignores foreign players
     * The purpose of this is for interpolation. So that the player doesn't have to wait
     * for the servers response to render the player in a new state.
     * If the client is notified.
     */
    renderplayer(){
        if (this.player.currentqueue){
            this.player.play(`${this.player.class}attack`,true);
        } else if (this.player.hurt){
            this.player.play(`${this.player.class}hurt`,true)
        } else if (this.player.body.velocity.x < 0){
            this.player.flipX = false;
            this.player.anims.play(`${this.player.class}left`,true);
        } else if (this.player.body.velocity.x > 0){
            this.player.flipX = true;
            this.player.anims.play(`${this.player.class}left`,true);
        } else if (this.player.body.velocity.y > 0){
            this.player.anims.play(`${this.player.class}down`,true);
        } else if (this.player.body.velocity.y < 0){
            this.player.anims.play(`${this.player.class}up`,true);
        } else {
            this.player.anims.stop();
        }

        this.player.setDepth(this.player.y);
    }

    /**
     * Sends messages to the Debug_Scene with helpful data for debugging.
     */
    renderdebug(){
        this.events.emit('debug', {
            player: this.player,
            cameras: this.cameras,
        })
    }

    /**
     * Sends messages to all UI scenes with helpful data for player convenience
     */
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

    /**
     * The Game Loop.
     * @param {Float} time Total time requestanimationframe has been running
     * @param {Float} delta Time difference since the time it took to loop the most previous time.
     */
    update(time, delta){
        this.phys()
        this.renderdebug();
        this.renderplayer();
        this.renderui();
    }
}