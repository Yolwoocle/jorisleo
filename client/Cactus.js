import Enemy from "./Enemy"

export default class Cactus extends Enemy {
    constructor(){
        super()
        let catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
        this.texture = catT[Math.floor(Math.random() * 4)]
    }
}