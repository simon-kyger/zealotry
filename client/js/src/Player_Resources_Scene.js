import Draggable_Container from '/js/src/Draggable_Container.js';
export default class Player_Resources_Scene extends Phaser.Scene {
    constructor(args){
        super({key: "Player_Resources_Scene", active: true});
    }
    preload(){
        this.load.json('CFG', 'CFG.json');
    }
    creategraphic(){
        const {player_resources} = this.cache.json.get('CFG');
        const {width, height} = this.sys.game.canvas;
        this.barwidth = player_resources.barwidth;
        this.barheight = player_resources.barheight;
        this.elements = player_resources.elements;
        this.targetbar = this.add.graphics();
        this.hpbar = this.add.graphics();
        this.endbar = this.add.graphics()
        this.manabar = this.add.graphics()
        this.border = this.add.graphics().lineStyle(1, 0x000000);
        this.targetname = this.add.text(0, 0, '', {
            font: '16px Segoe UI',
            fill: '#CCCCCC',
            align: 'center'
        })
        this.hppercent = this.add.text(0, this.barheight, '', { 
            font: '16px Segoe UI', 
            fill: '#CCCCCC', 
        })
        this.endpercent = this.add.text(0, this.barheight*2, '', { 
            font: '16px Segoe UI', 
            fill: '#CCCCCC', 
        })
        this.manapercent = this.add.text(0, this.barheight*3, '', { 
            font: '16px Segoe UI', 
            fill: '#CCCCCC', 
        })
      
        this.container = new Draggable_Container(
            this, 
            width/2-this.barwidth/2, 
            height-this.barheight*this.elements, 
            this.barwidth, 
            this.barheight*this.elements, 
            [this.targetbar, this.targetname, this.hpbar,this.endbar,this.manabar, this.border, this.hppercent, this.endpercent, this.manapercent]
        )
    }
    draw(data){
        const {currenthp, maxhp, currentmana, maxmana, currentend, maxend, target} = data;
        const hpmod = currenthp / maxhp;
        const manamod = currentmana / maxmana;
        const endmod = currentend / maxend;
        const targetmod = target ? target.currenthp / target.maxhp : null;

        this.targetbar.clear();
        this.targetbar.fillGradientStyle(0x000000, 0x4B0082, 0x000000, 0x4B0082);
        this.targetbar.fillRect(0, 0, this.barwidth*targetmod, this.barheight)

        this.hpbar.clear();
        this.hpbar.fillGradientStyle(0x000000, 0xFF0000, 0x000000, 0xFF0000);
        this.hpbar.fillRect(0, this.barheight, this.barwidth*hpmod, this.barheight)
        
        this.endbar.clear();
        this.endbar.fillGradientStyle(0x000000, 0x006400, 0x000000, 0x006400);
        this.endbar.fillRect(0, this.barheight*2, this.barwidth*endmod, this.barheight)

        this.manabar.clear();
        this.manabar.fillGradientStyle(0x000000, 0x0000FF, 0x000000, 0x0000FF);
        this.manabar.fillRect(0, this.barheight*3, this.barwidth*manamod, this.barheight);
        
        this.border.clear();
        this.border.strokeRect(0, 0, this.barwidth, this.barheight*this.elements);

        if (target){
            this.targetname.setText(`${target.name}`)
            this.targetname.x = this.barwidth / target.name.length
        } else {
            this.targetname.setText(`${''}`);
        }
        this.hppercent.setText(`${hpmod*100}`);
        this.endpercent.setText(`${endmod*100}`);
        this.manapercent.setText(`${manamod*100}`);
    }
    create(){
        this.gfx = this.creategraphic();
        this.scene.get('Overworld_Scene').events.on('updateresources', data=>{
            this.draw(data);
        })
        this.scene.get('Overworld_Scene').events.on('resetUI', ()=>{
            this.gfx = this.creategraphic();
        })
    }
}