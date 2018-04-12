class Overworld extends Phaser.Scene {
    constructor(args){
        super({key: "Overworld"});
        this.player = args.player;
        this.players = args.players;
        this.lag = 0;
        this.fps = 60;
        this.frameduration = 1000/ this.fps;
    }

    preload(){
        this.load.tilemapTiledJSON('map', 'assets/zealotrymap.json');
        this.load.image('backgroundtiles', 'assets/backgroundtiles.png');
        this.load.atlas('players', 'assets/players.png', 'assets/players.json');
    }

    create(){
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0);
        
        //player character data
        //need to make net requests for other players here and configure createplayer to attach camera only for this player
        this.createplayer();
        this.player.fixedToCamera = true;

        //camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: .2
        }
        this.controls = new Phaser.Cameras.Controls.Fixed(this.controlConfig);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }
    createplayer(data){
        const mp = {
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
        let player = mp[this.player.class];
        this.player.sprite = this.add.sprite(300, 150, 'players', `${player}/0`).setScrollFactor(0);
        this.player.facing = 'down';
        
        let config = [
            {
                key: 'movedown',
                frames: this.anims.generateFrameNames('players', {
                    start: 0,
                    end: 2,
                    prefix: `${player}/`
                }),
                frameRate: 8,
                repeat: -1
            },
            {
                key: 'moveup',
                frames: this.anims.generateFrameNames('players', {
                    start: 3,
                    end: 5,
                    prefix: `${player}/`
                }),
                frameRate: 8,
                repeat: -1
            },
            {
                key: 'moveleft',
                frames: this.anims.generateFrameNames('players', {
                    start: 6,
                    end: 8,
                    prefix: `${player}/`
                }),
                frameRate: 8,
                repeat: -1
            }
        ];
        config.forEach(anim=> this.anims.create(anim));
    }
    phys(delta){
        this.controls.update(delta);
        if (this.cursors.left.isDown){
            socket.emit('move', {dir: 'left'});
        } else if (this.cursors.right.isDown){
            socket.emit('move', {dir: 'right'});
        }
        if (this.cursors.up.isDown){
            socket.emit('move', {dir: 'up'});
        } else if (this.cursors.down.isDown){
            socket.emit('move', {dir: 'down'});
        }
        socket.on('newplayer', data=>{
            this.createplayer(data);
        })
        socket.on('removeplayer', data=>{
            this.removeplayer(data);
        });
        socket.on('move', data=> {
            data.forEach(player=>{
                if (player.name == this.player.name){
                    this.cameras.main.scrollX = player.pos.x;
                    this.cameras.main.scrollY = player.pos.y;
                } else {
                    //update other players;
                }
            })
        });
    }

    render(){
        if (this.cursors.left.isDown){
            this.player.sprite.flipX = false;
            if (this.player.facing != 'left'){
                this.player.sprite.anims.play('moveleft');
                this.player.facing = 'left';
            }
        } else if (this.cursors.right.isDown){
            this.player.sprite.flipX = true;
            if (this.player.facing != 'right'){
                this.player.sprite.anims.play('moveleft');
                this.player.facing = 'right';
            }
        } else if (this.cursors.down.isDown){
            if (this.player.facing != 'down'){
                this.player.sprite.anims.play('movedown');
                this.player.facing = 'down';
            }
        } else if (this.cursors.up.isDown){
            if (this.player.facing != 'up'){
                this.player.sprite.anims.play('moveup');
                this.player.facing = 'up';
            }
        } else if (this.cursors.right.isUp || this.cursors.left.isUp || this.cursors.up.isUp || this.cursors.down.isUp){
            this.player.sprite.anims.stop();
            this.player.sprite.anims.currentFrame = 0;
            if (this.player.facing != 'idle'){
                this.player.facing = 'idle';
            }
        }
    }

    update(timestamp, elapsed){
        this.lag += elapsed;
        while(this.lag >= this.frameduration){
            this.phys(this.frameduration);
            this.lag -= this.frameduration;
        }
        this.render(this.lag/this.frameduration);
    }
}