class Ability_Bar_Scene extends Phaser.Scene {
    constructor(args){
        super({key: "Ability_Bar_Scene", active: true});
    }
    preload(){
        this.load.json('CFG', 'CFG.json');
    }
    creategraphic(){
        const {ability_bar} = this.cache.json.get('CFG');
        const {width, height} = this.sys.game.canvas;
        this.barwidth = ability_bar.barwidth;
        this.barheight = ability_bar.barheight;
        this.gcdbar = this.add.graphics();
        this.border = this.add.graphics().lineStyle(1, 0x000000);
      
        this.container = new Draggable_Container(
            this, 
            width/2-this.barwidth/2, 
            0, 
            this.barwidth, 
            this.barheight, 
            [this.gcdbar, this.border]
        )
    }
    draw(data){
        const {gcd, value} = data;
        console.log(gcd);
        const targetmod = gcd / value
        this.gcdbar.clear();
        this.gcdbar.fillStyle(0xFFFF00);
        this.gcdbar.fillRect(0, 0, this.barwidth*targetmod, this.barheight)
        this.border.strokeRect(0, 0, this.barwidth, this.barheight);
    }
    create(){
        let graphics = this.creategraphic();
        this.scene.get('Overworld').events.on('updateabilities', data=>{
            this.draw(data);
        })
    }
}