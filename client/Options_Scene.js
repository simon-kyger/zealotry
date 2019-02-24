class Options_Scene extends Phaser.Scene {
    constructor(){
        super({
            key: "Options_Scene", 
            active: true,
            visible: false,
        });
        this.shownameplatesboolean = true;
    }
    listeners(){
        this.scene.sleep(this);
        this.input.keyboard.on('keyup', e=>{ 
            if (e.keyCode == 27){
                this.scene.sleep(this);
            }
        });
    }
    main(){
        const offsetx = 50;
        const offsety = 50;
        const mainbackground = this.add.graphics()
        mainbackground.fillStyle(0x000000, 0.4);
        mainbackground.fillRect(0, 0, this.width-offsetx*2, this.height-offsety*2)
        const container = this.add.container(
            offsetx,
            offsety,
            [
                mainbackground,
                this.close(this.width-offsetx*2, this.height-offsety*2, 40, 40, 10),
                this.resetui(this.width-offsetx*2, this.height-offsety*2, 400, 40, 10),
                this.shownameplates(this.width-offsetx*2, this.height-offsety*2, 200, 40, 10),
                this.shownameplatesvalue(this.width-offsetx*2, this.height-offsety*2, 200, 40, 10),
            ]
        )
            .setSize(this.width-offsetx, this.height-offsety)
    }
    shownameplatesvalue(x, y, width, height, borderthickness){
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, width, height);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, width, height)

        let text = this.add.text(8, 10, this.shownameplatesboolean, {
            font: `${22}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            x/2 - width + borderthickness/2 + width + borderthickness/2,
            borderthickness/2 + height,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(width, height)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                this.shownameplatesboolean = !this.shownameplatesboolean;
                let overworld = this.scene.get('Overworld');
                const nameplates = overworld.nameplates;
                overworld.shownameplatesboolean = this.shownameplatesboolean;
                for (let key in nameplates){
                    nameplates[key].setVisible(this.shownameplatesboolean)
                }
                text.setText(this.shownameplatesboolean.toString())
            });
        container.input.hitArea.x += width/2;
        container.input.hitArea.y += height/2;
        return container;
    }
    shownameplates(x, y, width, height, borderthickness){
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, width, height);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, width, height)

        const text = this.add.text(8, 10, 'Display Nametags', {
            font: `${22}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            x/2 - width + borderthickness/2,
            borderthickness/2 + height,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(width, height)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                // const PRSc = this.scene.get('Player_Resources_Scene').container;
                // PRSc.x = PRSc.defaultposition.x
                // PRSc.y = PRSc.defaultposition.y
            });
        container.input.hitArea.x += width/2;
        container.input.hitArea.y += height/2;
        return container;
    }
    resetui(x, y, width, height, borderthickness){
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, width+borderthickness/2, height);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, width+borderthickness/2, height)

        const text = this.add.text(8, 8, 'ResetUI', {
            font: `${22}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            x/2 -width/2 + borderthickness/2,
            borderthickness/2,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(width+borderthickness/2, height)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                const PRSc = this.scene.get('Player_Resources_Scene').container;
                PRSc.x = PRSc.defaultposition.x
                PRSc.y = PRSc.defaultposition.y
                const ABSc = this.scene.get('Ability_Bar_Scene').container;
                ABSc.x = ABSc.defaultposition.x
                ABSc.y = ABSc.defaultposition.y
            });
        container.input.hitArea.x += width/2;
        container.input.hitArea.y += height/2;
        return container;
    }
    close(x, y, width, height, borderthickness){
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, width, height);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, width, height)

        const text = this.add.text(6, 0, 'X', {
            font: `${width}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            x - width-borderthickness/2,
            borderthickness/2,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(width, height)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                this.events.emit('closeoptions')
            });
        container.input.hitArea.x += width/2;
        container.input.hitArea.y += height/2;
        return container;
    }
    create(){
        const {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        this.listeners();
        this.main();
    }
}