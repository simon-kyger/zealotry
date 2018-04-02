class Overworld extends Phaser.Scene {
    constructor(){
        super({key: "Overworld"});
    }

    preload(){
        this.load.tilemapTiledJSON('map', 'data/zealotrymap.json');
        this.load.image('backgroundtiles', 'img/backgroundtiles.png');
        this.load.spritesheet('players', 'img/players.gif', {frameWidth: 24, frameHeight: 32});
    }

    create(){
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0);
        
        //player character data
        const config = {
            key: 'move',
            frames: this.anims.generateFrameNumbers('players', {
                start: 6,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1
        };
        this.anims.create(config);
        this.player = this.add.sprite(300, 150, 'players').setScrollFactor(0);
        this.player.fixedToCamera = true;
        this.player.anims.play('move');
        
        
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
    }
}