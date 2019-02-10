class Debugscene extends Phaser.Scene {
    constructor(args){
        //setup and variable initializations
        super({key: "Debugscene", active: true});
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
        const template = `
----------------------------DEBUG-----------------------------
CURRENT CONTROLS: UP DOWN LEFT RIGHT ARROWS, Q/E == ZOOM
this.player {
    x: ${data.player.sprite.x ? data.player.sprite.x : null}  
    y: ${data.player.sprite.y ? data.player.sprite.y : null}  
}
Camera {
    scrollX: ${data.cameras.main.scrollX}
    scrollY: ${data.cameras.main.scrollY}
    zoom: ${data.cameras.main.zoom}
}`;
        this.debugtext.setText(template);
    }
    create(){
        this.createdebug();
        const overworld = this.scene.get('Overworld');
        overworld.events.on('debug', data=>{
            this.drawdebug(data);
        })
    }
}