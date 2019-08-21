export default class LoadAssets extends Phaser.Scene {

    constructor() {
        super({
            key: 'BootScene'
        });
    }

    preload(){
this.load.spritesheet("playerWalk", "sprites/dinoWalk.png",{
    frameWidth: 46,
    frameHeight: 49
});
this.load.spritesheet("playerJump", "sprites/dinoJump.png",{
    frameWidth: 46,
    frameHeight: 49
});
this.load.spritesheet("playerSit", "sprites/dinoSit.png",{
    frameWidth: 46,
    frameHeight: 49
});
this.load.spritesheet("playerCrouch", "sprites/dinoCrouch.png",{
    frameWidth: 46,
    frameHeight: 49
});
this.load.spritesheet("playerHit", "sprites/dinoDead.png",{
    frameWidth: 44,
    frameHeight: 47
});
this.load.spritesheet("playerShadow", "sprites/testShadow.png",{
    frameWidth: 20,
    frameHeight: 20
});
this.load.spritesheet("ptero", "sprites/ptero.png",{
    frameWidth: 46,
    frameHeight: 41
});
this.load.spritesheet('cloud2', "sprites/cloud2.png",{
    frameWidth: 23,
    frameHeight: 20,
});
this.load.spritesheet('cactusW1', "sprites/cactusWing1.png",{
    frameWidth: 33,
    frameHeight: 35,
});
this.load.spritesheet('stego', "sprites/stego.png",{
    frameWidth: 39,
    frameHeight: 19,
});





this.load.image('ground', 'sprites/ground.png');
this.load.image('playerSitGift', 'sprites/dinoSitGift.png');
this.load.image('cactusS1', 'sprites/cactusS1.png');
this.load.image('cactusS2', 'sprites/cactusS2.png');
this.load.image('cactusB1', 'sprites/cactusB1.png');
this.load.image('cactusB2', 'sprites/cactusB2.png');
this.load.image('dynamite', 'sprites/dynamite.png');
this.load.image('flash', 'sprites/whiteFlash.png');
this.load.image('cloud1', 'sprites/cloud1.png');
this.load.image('life', 'sprites/life.png');
this.load.image('blank', 'sprites/blank.png');





this.load.audio('jump1', 'sounds/jump1.wav');
this.load.audio('jump2', 'sounds/jump2.wav');
this.load.audio('jump3', 'sounds/jump3.wav');
this.load.audio('jump4', 'sounds/jump4.wav');
this.load.audio('jump5', 'sounds/jump5.wav');
this.load.audio('jump6', 'sounds/jump6.wav');
this.load.audio('crouch', 'sounds/crouch.wav');
this.load.audio('landCrouch', 'sounds/landCrouch.wav');
this.load.audio('boom', 'sounds/explosion.wav');
this.load.audio('damage', 'sounds/damage.wav');
this.load.audio('break', 'sounds/cactusBreak.wav');





this.anims.create({
    key: "playerWalk",
    frames: this.anims.generateFrameNumbers("playerWalk"),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
    key: "playerJump",
    frames: this.anims.generateFrameNumbers("playerJump"),
    frameRate: 10,
});
this.anims.create({
    key: "playerHitA",
    frames: this.anims.generateFrameNumbers("playerHit"),
    frameRate: 10
});
this.anims.create({
    key: "ptero",
    frames: this.anims.generateFrameNumbers("ptero"),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
    key: "cloud2",
    frames: this.anims.generateFrameNumbers("cloud2"),
    frameRate: 10,
    repeat: -1
});
this.anims.create({
    key: "cactusW1",
    frames: this.anims.generateFrameNumbers("cactusW1"),
    frameRate: 4,
    repeat: -1
});
this.anims.create({
    key: "stego",
    frames: this.anims.generateFrameNumbers("stego"),
    frameRate: 2,
    repeat: -1
});
    }

}