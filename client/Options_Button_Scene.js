class Options_Button_Scene extends Phaser.Scene {
    constructor(){
        super({key: "Options_Button_Scene", active: true});
        this.width = 80;
        this.height = 32;
        this.borderthickness = 8;
    }
    create(){
        const {width, height} = this.sys.game.canvas;

        this.border = this.add.graphics().lineStyle(this.borderthickness, 0x0A0A0A);
        this.border.strokeRect(0, 0, this.width, this.height);

        this.background = this.add.graphics()
        this.background.fillStyle(0x1D3D3D);
        this.background.fillRect(0, 0, this.width, this.height)

        this.text = this.add.text(6, 8, 'OPTIONS', {
            font: '16px Segoe UI',
            fill: '#CCCCCC',
            align: 'center'
        }).setOrigin(0)

        this.container = this.add.container(
            width - this.width -this.borderthickness/2,
            this.borderthickness/2,
            [
                this.border,
                this.background, 
                this.text
            ]
        )
            .setSize(this.width, this.height)
            .setInteractive()
            .on('pointerdown', (p, x, y) => {
                this.scene.wake('Options_Scene');
            });
        this.container.input.hitArea.x += this.width/2;
        this.container.input.hitArea.y += this.height/2;
    }
}