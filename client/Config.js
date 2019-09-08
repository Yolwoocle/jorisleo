export default class Config {

    constructor() {


    this.gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: true,
                //Set debug to true to activate debug mode (+ infini-lives)
            }
        },
        pixelArt: true,
        backgroundColor: "#f7f7f7"
    };


 
    this.gameOptions = {
        jumpVelocity: 700,
        platformSpeed: 200,
        playerStartPosition: 100,
        jumpNumber: 2,
        cactusLimit: 800,
        pteroLimit: 500,
        dynaLimit: 10000,
        dynaSpawnTime: 80, //time in frames
        doubleJumpsMax: 2,
        invu: 1600,
        crouchJumpTime: 20, 
        pteroOffset: 100,
        spawnDelay : 1000,
        spawnDelayDefault : 1000,
        cloudDensity : 25,
        floorHeight : 10,
        speed : 6,
    }

} 
    
}