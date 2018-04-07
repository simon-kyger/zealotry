class Overworld extends Phaser.Scene {
    constructor(){
        super({key: "Overworld"});
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
        const player = 'relm';
        this.player = this.add.sprite(300, 150, 'players', `${player}/0`).setScrollFactor(0);
        this.player.facing = 'down';
        
        let config = [{
            key: 'movedown',
            frames: this.anims.generateFrameNames('players', {
                start: 0,
                end: 2,
                prefix: `${player}/`
            }),
            frameRate: 8,
            repeat: -1
        },{
            key: 'moveup',
            frames: this.anims.generateFrameNames('players', {
                start: 3,
                end: 5,
                prefix: `${player}/`
            }),
            frameRate: 8,
            repeat: -1
        },{
            key: 'moveleft',
            frames: this.anims.generateFrameNames('players', {
                start: 6,
                end: 8,
                prefix: `${player}/`
            }),
            frameRate: 8,
            repeat: -1
        }];
        config.forEach(anim=> this.anims.create(anim));
        this.player.fixedToCamera = true;
        
        
        //camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: .25
        }
        this.controls = new Phaser.Cameras.Controls.Fixed(this.controlConfig);
    }

    update(time, delta){
        this.controls.update(delta);
        if (this.cursors.left.isDown){
            this.player.flipX = false;
            if (this.player.facing != 'left'){
                this.player.anims.play('moveleft');
                this.player.facing = 'left';
            }
        } else if (this.cursors.right.isDown){
            this.player.flipX = true;
            if (this.player.facing != 'right'){
                this.player.anims.play('moveleft');
                this.player.facing = 'right';
            }
        } else if (this.cursors.down.isDown){
            if (this.player.facing != 'down'){
                this.player.anims.play('movedown');
                this.player.facing = 'down';
            }
        } else if (this.cursors.up.isDown){
            if (this.player.facing != 'up'){
                this.player.anims.play('moveup');
                this.player.facing = 'up';
            }
        } else {
            this.player.anims.stop();
            this.player.anims.currentFrame = 0;
            this.player.facing = 'idle';
        }
    }

}