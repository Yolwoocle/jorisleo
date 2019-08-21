export default class Config {

    constructor() {
    } 


    gameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: true,
            }
        },
        pixelArt: true,
        scene: [
            LoadAssets,
            GameScene
        ],
        backgroundColor: "#f7f7f7"
    };
 
    gameOptions = {
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
    }

    
}