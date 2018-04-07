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
        const player = 'locke';
        const config = {
            key: 'move',
            frames: this.anims.generateFrameNames('players', {
                start: 0,
                end: 1,
                prefix: `${player}/`
            }),
            frameRate: 10,
            repeat: -1
        };
        this.anims.create(config);
        this.player = this.add.sprite(300, 150, 'players', `${player}/0`).setScrollFactor(0);
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