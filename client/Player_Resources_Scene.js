class Player_Resources_Scene extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Player_Resources_Scene", active: true});
        this.width = 200;
        this.height = 20;
        this.hpmod = 1;
    }
    createwindow(){
        const {width, height} = this.sys.game.canvas;
        this.hpbar = this.add.graphics().setDepth(1).setScrollFactor(0);
        this.hpbar.fillStyle(0xff0000,1);
    }
    draw(data){
        const {currenthp, maxhp} = data;        
        const hpmod = currenthp / maxhp;
        const {width, height} = this.sys.game.canvas;
        this.hpbar.fillRect(width/2-this.width/2, height-this.height, this.width*hpmod, height)
    }
    create(){
        this.createwindow();
        this.scene.get('Overworld').events.on('updatehp', data=>{
            this.draw(data);
        })
    }
}