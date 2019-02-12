class Debug_Scene extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Debug_Scene", active: true});
    }
    createdebug(){
        this.debugtext = this.add.text(0, 0, '', { 
            font: '20px Monospace', 
            fill: '#ff0000', 
            backgroundColor: 'rgba(0, 0, 0, .6)' 
        },this.debuggroup).setDepth(1).setScrollFactor(0);
        this.debugtext.fixedToCamera = true;
    }
    drawdebug(data){
        let p = data && data.player && data.player.sprite //evalutes to the first undefined bullshit then stops without going further
        let c = data && data.cameras && data.cameras.main
        const template = `
----------------------------DEBUG-----------------------------
CURRENT CONTROLS: WASD MOVEMENT, Q/E == ZOOM
this.player {
    x: ${p.x}  
    y: ${p.y}  
}
Camera {
    scrollX: ${c.scrollX}
    scrollY: ${c.scrollY}
    zoom: ${c.zoom}
}`;
        this.debugtext.setText(template);
    }
    create(){
        this.createdebug();
        this.scene.get('Overworld').events.on('debug', data=>{
            this.drawdebug(data);
        })
    }
}