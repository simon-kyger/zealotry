class Overworld extends Phaser.Scene {
    constructor(){
        super({key: "Overworld"});
    }

    preload(){
        this.load.tilemapTiledJSON('map', 'data/zealotrymap.json');
        this.load.image('backgroundtiles', 'img/backgroundtiles.png');
        this.load.image('players', 'img/players.gif');
    }

    create(){
        //map data
        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('backgroundtiles');
        this.layer = this.map.createStaticLayer('Tile Layer 1', this.tileset, 0, 0);
        this.layer.setScale(2);
        
        //player character data
        const player = 'Locke';
        this.players = this.add.image(400, 300, 'players');
        this.players.setScale(2);
        
        //camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: 1.0
        }
        this.controls = new Phaser.Cameras.Controls.Fixed(this.controlConfig);
    }

    update(time, delta){
        this.controls.update(delta);
    }
}