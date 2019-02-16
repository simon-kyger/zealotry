class Options_Scene extends Phaser.Scene {
    constructor(){
        super({
            key: "Options_Scene", 
            active: true,
            visible: false,
        });
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
                this.close(this.width-offsetx*2, this.height-offsety*2),
                this.resetui(this.width-offsetx*2, this.height-offsety*2),
            ]
        )
            .setSize(this.width-offsetx, this.height-offsety)
    }
    resetui(width, height){
        const elwidth = 200;
        const elheight = 40;
        const borderthickness = 10;
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, elwidth, elheight);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, elwidth, elheight)

        const text = this.add.text(6, 0, 'ResetUI', {
            font: `${elheight}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            width/2 - elwidth/2 - borderthickness/2,
            borderthickness/2,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(elwidth, elheight)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                const PRSc = this.scene.get('Player_Resources_Scene').container;
                PRSc.x = PRSc.defaultposition.x
                PRSc.y = PRSc.defaultposition.y
            });
        container.input.hitArea.x += elwidth/2;
        container.input.hitArea.y += elheight/2;
        return container;
    }
    close(width, height){
        const elwidth = 40;
        const elheight = 40;
        const borderthickness = 10;
        const border = this.add.graphics().lineStyle(borderthickness, 0x0A0A0A);
        border.strokeRect(0, 0, elwidth, elheight);

        const background = this.add.graphics()
        background.fillStyle(0x1D3D3D);
        background.fillRect(0, 0, elwidth, elheight)

        const text = this.add.text(6, 0, 'X', {
            font: `${elwidth}px Segoe UI`,
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        const container = this.add.container(
            width - elwidth-borderthickness/2,
            borderthickness/2,
            [
                border,
                background, 
                text
            ]
        )
            .setSize(elwidth, elheight)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                this.scene.sleep(this);
            });
        container.input.hitArea.x += elwidth/2;
        container.input.hitArea.y += elheight/2;
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