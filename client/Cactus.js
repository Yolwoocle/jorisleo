import Enemy from "./Enemy"

export default class Cactus extends Enemy {
    constructor(config){
        this.thescene = config.scene
        this.posX = config.posX
        this.posY = config.posY
        let catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
        this.texture = catT[Math.floor(Math.random() * 4)]
        super(this.thescene, this.posX, this.posY,this.texture);
    }
}