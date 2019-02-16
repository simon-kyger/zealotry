class Draggable_Container extends Phaser.GameObjects.Container {  
    constructor(scene, x, y, width, height, children){
        super(scene, x, y, children)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.defaultposition = {
            x: x,
            y: y,
            width: width,
            height: height
        }

        scene.add.existing(this)
        this.setSize(width, height, false)
        this.setInteractive()
        .on('drag', (p, x, y) => {
            this.setX(p.x - this._dragX + width / 2)
            this.setY(p.y - this._dragY + height / 2)
        })
        .on('pointerdown', (p, x, y) => {
            this._dragX = x
            this._dragY = y
        })

        this.input.hitArea.x += width/2;
        this.input.hitArea.y += height/2;

        scene.input.setDraggable(this, true)
    }
}