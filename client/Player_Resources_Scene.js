class Player_Resources_Scene extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Player_Resources_Scene", active: true});
        this.width = 200;
        this.height = 20;
        this.elements = 3;
    }
    creategraphic(){
        this.hpbar = this.add.graphics().setDepth(1).setScrollFactor(0);
        this.hpbar.fillStyle(0xff0000,1);
        this.endbar = this.add.graphics().setDepth(1).setScrollFactor(0);
        this.endbar.fillStyle(0x00ff00,1);
        this.manabar = this.add.graphics().setDepth(1).setScrollFactor(0);
        this.manabar.fillStyle(0x0000ff,1);
    }
    draw(data){
        const {currenthp, maxhp, currentmana, maxmana, currentend, maxend} = data;
        const hpmod = currenthp / maxhp;
        const manamod = currentmana / maxmana;
        const endmod = currentend / maxend;
        const {width, height} = this.sys.game.canvas;
        this.hpbar.fillRect(width/2-this.width/2, height-this.height*this.elements, this.width*hpmod, height)
        this.endbar.fillRect(width/2-this.width/2, height-this.height*(this.elements-1), this.width*hpmod, height)
        this.manabar.fillRect(width/2-this.width/2, height-this.height*(this.elements-2), this.width*hpmod, height)
    }
    create(){
        this.creategraphic();
        this.scene.get('Overworld').events.on('updateresources', data=>{
            this.draw(data);
        })
    }
}