import LoadAssets from "./LoadAssets";
import Config from "./Config";


function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomRnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
} 

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });
    }

preload()
{
    console.log("preload")
    this.sound.add('jump1');
    this.sound.add('jump2');
    this.sound.add('jump3');
    this.sound.add('jump4');
    this.sound.add('jump5');
    this.sound.add('jump6');
    this.sound.add('crouch');
    this.sound.add('landCrouch');
    this.sound.add('boom');
    this.sound.add('damage');
    this.sound.add('break');


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

    audio: {
        disableWebAudio: false
    }
}

create()
{
    console.log("create")
    this.add.text(0, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });

    this.camera;
    this.isSit = false;
    this.sitTimeout;
    this.spawnTimeout;
    this.waveType;
    this.canSoundCrouch;
    this.canLandCrouchSnd;
    this.cameraShake = 0;
    this.cameraShakePositive = 0;
    this.cameraShakeDirection = true;
    this.cloudDensSeed = 0;
    var platforms;
    var cursors;
    this.player;
    var map;
    var groundLayer;
    var obstacleGroup;
    this.groundLayer2;
    this.playerShadow;
    this.cactusT = [];
    this.pteroT = [];
    this.canCactus = true;
    this.life = 3
    this.hasCrouched = false;
    this.crouchCounter
    this.canDyna = true
    this.canPtero = true
    this.canDouble = false;
    this.canSpawn = true;
    this.jumpCounter;
    this.score = 0;
    this.cloudT = [];
    let scene = this;
    this.config = new Config();
    this.groundLayer = this.physics.add.staticSprite(10, 590, 'blank');
    this.groundLayer.setSize(800, 10);
    this.groundLayer.body.immovable = true;
    this.groundLayer2 = this.add.tileSprite(400, 572, 1200, 25, 'ground');

    this.player = this.physics.add.sprite(this.config.gameOptions.playerStartPosition, 450, 'playerS2');
    this.player.depth = 100;
    this.playerShadow = this.add.sprite((this.config.gameOptions.playerStartPosition - 5), 580, 'this.playerShadow');
    this.playerShadow.depth = 1;
    this.playerShadow.alpha = 0.2;
    this.playerShadow.blendMode = 'MULTIPLY';

    this.player.play('playerJump');
    this.player.setSize(46, 49, true);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(this.config.gameConfig.physics.arcade.gravity.y);
    this.player.jumps = 0;
    this.player.isHit = false;
    this.player.isInvulnerable = false;
    this.hasClicked = false;
    this.physics.add.collider(this.player, this.groundLayer);
    this.player.setInteractive();
    this.player.on('pointerdown', function () {
        if (!this.hasClicked) {
            scene.jump();
            this.hasClicked = true
        }
    })

    this.jump = function () {
        this.jumpCounter += 1
        if (this.player.body.touching.down) {
            this.player.jumps = 0;
            this.jumpCounter = 1
        }
        if (!this.player.body.touching.down && this.hasCrouched && this.canDouble/*&& !hasDoubled*/) {
            this.player.jumps -= this.config.gameOptions.doubleJumpsMax;
            this.canDouble = false;
            //hasDoubled = true;
        }
        if (this.player.jumps < this.config.gameOptions.jumpNumber && !(this.crouchCounter > this.config.gameOptions.crouchJumpTime)) {
            this.player.jumps++;
            this.player.setVelocityY(-this.config.gameOptions.jumpVelocity);
            switch (this.jumpCounter) {
                case 1:
                    this.sound.play('jump1');
                    break;
                case 2:
                    this.sound.play('jump2');
                    break;
                case 3:
                    this.sound.play('jump3');
                    break;
                case 4:
                    this.sound.play('jump4');
                    break;
                case 5:
                    this.sound.play('jump5');
                    break;
                case 6:
                    this.sound.play('jump6');
                    break;
                default:
                    console.log("ERROR SOUND")
                    break;

            }
            this.player.play('playerJump');
        }
        if (this.player.jumps < -this.config.gameOptions.doubleJumpsMax) {
            this.player.jumps = -this.config.gameOptions.doubleJumpsMax;
        }
        if (!(this.keys.DOWN.isDown || this.keys.S.isDown) && this.crouchCounter > this.config.gameOptions.crouchJumpTime && this.player.body.touching.down) {
            this.player.setVelocityY(-this.config.gameOptions.jumpVelocity * 1.2);
            this.sound.play('jump1');
            this.jumpCounter -= 1
        }
    }
    this.keys = {};
    this.keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keys.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.Y = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);



    this.input.keyboard.on('keydown_UP', function () {
        scene.jump();
    });

    this.input.keyboard.on('keydown_Z', function () {
        scene.jump();
    });

    this.addCactus = function (posX, posY, ratio, bounce, type) {
        let catT;
        let cactus;
        switch (type) {
            case 0:
                catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
                cactus = this.physics.add.sprite(posX, posY, catT[Math.floor(Math.random() * 4)]);
                break;
            case 1:
                cactus = this.physics.add.sprite(posX, posY, 'cactusW1');
                cactus.play('cactusW1');
                break;
            case 2:
                cactus = this.physics.add.sprite(posX, posY, 'stego');
                cactus.play('stego');
        }
        cactus.body.setGravityY(this.config.gameConfig.physics.arcade.gravity.y);
        cactus.setBounce(bounce);
        cactus.scaleX = ratio;
        cactus.scaleY = ratio;
        this.physics.add.collider(cactus, this.groundLayer, function (cldPlayer, cldCactus) {
            cactus.hasLanded = true;
        });
        // this.physics.add.collider(cactus, this.groundLayer2);
        cactus.hasTouched = false;
        cactus.hasLanded = false;
        cactus.type = type
        cactus.setInteractive();
        cactus.on('pointerdown', function () {
            scene.sound.play('break');
            if (cactus.type !== 1) {
                cactus.destroy();
            }
            else {
                cactus.type = 0;
                cactus.body.setGravityY(10000);
                cactus.anims.stop();
                cactus.setTexture('cactusS1');
                cactus.setBounce(0.1);
                cactus.body.width /= 2;
            }
        })
        cactus.on('pointerover', function (pointer, localX, localY, event) {
            cactus.setAlpha(0.4);
        });
        cactus.on('pointerout', function (pointer, localX, localY, event) {
            cactus.setAlpha(1);
        });
        this.physics.add.overlap(this.player, cactus, function (cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        this.cactusT.push(cactus);
        /*switch(type){
            case 0:
                break;
            case 1:
                    cactus.body.width /= 2;
                break;
        }*/
    }

    this.addPtero = function (posX, posY, ratio) {
        let ptero = this.physics.add.sprite(posX, posY, 'ptero');
        ptero.play('ptero');
        ptero.body.setGravityY(-this.config.gameConfig.physics.arcade.gravity.y);
        ptero.hasTouched = false;
        ptero.speed = ratio + 6;
        this.physics.add.overlap(this.player, ptero, function (cldPlayer, cldPtero) {
            if (!cldPtero.hasTouched) {
                cldPtero.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        this.pteroT.push(ptero);
        ptero.setInteractive();
        ptero.on('pointerdown', function () {
            scene.sound.play('break');
            ptero.destroy();
        })
        ptero.on('pointerover', function (pointer, localX, localY, event) {
            ptero.setAlpha(0.4);
        });
        ptero.on('pointerout', function (pointer, localX, localY, event) {
            ptero.setAlpha(1);
        });
    }

    this.addCloud = function (posX, posY, ratio) {
        let type = getRandomRnd(1, 11);
        let cloud
        if (type !== 1) {
            cloud = this.physics.add.sprite(posX, posY, 'cloud1');
        }
        else {
            cloud = this.physics.add.sprite(posX, posY, 'cloud2');
            cloud.play('cloud2');
        }
        cloud.setDepth(-1000);
        cloud.speed = ratio * 2;
        cloud.setScale(ratio, ratio);
        cloud.body.setGravityY(-this.config.gameConfig.physics.arcade.gravity.y);
        this.cloudT.push(cloud);
        //this.physics.add.overlap(this.player, cloud, function(cldPlayer, cldPtero) {
        //}, null, this);
    }

    /*this.addLife = function(posX, posY, ratio) {
        let life = this.physics.add.sprite(posX, posY, 'life');
        life.play('life'); 
        life.body.setGravityY(-this.config.gameConfig.physics.arcade.gravity.y);
        life.hasTouched = false;
        life.speed = ratio + 6;
        this.physics.add.overlap(this.player, life, function(cldPlayer, cldlife) {
            if (!cldlife.hasTouched) {
                this.config.gameOptions.life += 1
            }
        }, null, this);
        lifeT.push(life);
        life.setInteractive();
        life.on('pointerdown', function(){
                life.destroy();
        })
        life.on('pointerover', function(pointer, localX, localY, event){ 
            life.setAlpha(0.4);
         });
        life.on('pointerout', function(pointer, localX, localY, event){ 
            life.setAlpha(1);
         });
    }*/

    //ADD DYNA
    this.addDyna = function (posX, posY) {
        dynaGravityY = 500;
        this.dyna = this.physics.add.sprite(posX, posY, 'dynamite');
        this.dyna.setCollideWorldBounds(true);
        this.dyna.body.setGravityY(dynaGravityY);
        this.physics.add.collider(this.dyna, this.groundLayer);
        this.dyna.setVelocityX(300);
        this.dyna.setVelocityY(-700);
        this.canDyna = false
        setTimeout(function () {
            this.canDyna = true
        }, this.config.gameOptions.dynaLimit)
        // console.log(this.dyna);
        //  angle;

    }

    this.hitDino = function () {
        if (!this.player.isHit) {
            this.player.play('playerHitA')
            this.sound.play('damage');
            this.life -= 1;
            this.player.isHit = true;
            setTimeout(function () {
                this.player.isHit = false;
            }, this.config.gameOptions.invu)
            console.log('Touché');
        }
    }

    this.flash = this.add.sprite(this.config.gameConfig.width / 2, this.config.gameConfig.height / 2, 'flash');
    this.flash.setAlpha(0);

    let pointer = this.input.activePointer;
    let clkDownD;
    let clkDR;
    this.input.on('pointerdown', function (pointer) {
        switch (pointer.buttons) {
            case 1:
                clkDownD = new Date()
                break;
            case 2:
                clkDR = new Date()
                break;
        }
    })

    this.input.on('pointerup', function (pointer) {
        /*switch (pointer.buttons) {
            case 1:
               
            break;
            case 2: 
            
            break
        }*/
    })

    pointer = this.input.activePointer;


    console.log(this.player);
} 

update()
{
    console.log("update")
    if (this.config.gameConfig.debug) {
        this.life = 999999;
    }

    let scene = this;
    //this.player
    this.player.x = this.config.gameOptions.playerStartPosition;
    if (this.groundLayer2) {
        this.groundLayer2.tilePositionX += 4
    }

    this.playerShadow.alpha = (this.player.y / this.config.gameConfig.height) * 0.3;
    this.playerShadow.scaleX = ((this.player.y / this.config.gameConfig.height) * 0.5) + 0.7;
    this.playerShadow.scaleY = 0.5

    if (this.player.isHit) {
        if (this.player.alpha > 0.5) {
            this.player.alpha = 0.4;
        }
        else {
            this.player.alpha = 1;
        }
    }
    else {
        this.player.alpha = 1;
    }

    if (this.keys.DOWN.isDown || this.keys.S.isDown) {
        if (this.canSoundCrouch) {
            this.sound.play('crouch');
            this.canSoundCrouch = false;
        }
        if (!this.player.body.touching.down) {
            this.player.setTexture('playerSit');

            this.isSit = true;
            window.clearTimeout(sitTimeout);
            sitTimeout = setTimeout(function () {
                this.isSit = false;
            }, 200)
        }
        else {
            if (!this.isSit) {
                this.player.setTexture('playerCrouch');

            }
            else {
                if (this.canLandCrouchSnd) {
                    this.sound.play('landCrouch');
                    this.canLandCrouchSnd = false
                }
            }
        }
        //this.player.setTexture();
        this.player.body.setGravityY(10000);
        this.hasCrouched = true
    }
    else {
        this.player.body.setGravityY(this.config.gameConfig.physics.arcade.gravity.y);
        this.canSoundCrouch = true;
    }
    if (!(this.keys.DOWN.isDown || this.keys.S.isDown) && this.crouchCounter > this.config.gameOptions.crouchJumpTime) {
        this.jump();
        if (this.player.body.touching.down && this.crouchCounter > this.config.gameOptions.dynaSpawnTime && (!this.dyna || !this.dyna.body) && this.canDyna) {
            this.addDyna(this.player.x, this.player.y - 50);
        }
    }
    if (this.crouchCounter > this.config.gameOptions.dynaSpawnTime) {
        this.player.setTexture('playerSitGift');
    }

    if (this.life == 0) {
        setTimeout(function () {
            scene.scene.restart();
            this.config.gameOptions.spawnDelay = this.config.gameOptions.spawnDelayDefault;
        }, 1200)
        this.scene.pause();
        this.player.setAlpha(1);
    }

    if (this.player.body.touching.down) {
        this.hasClicked = false
        this.hasCrouched = false;
        this.canDouble = true;
        if (this.keys.DOWN.isDown || this.keys.S.isDown) {
            this.crouchCounter++;
        }
        if (this.player.anims.currentAnim.key != 'playerWalk') {
            if (!this.isSit && !this.player.isHit) {
                this.player.play('playerWalk');
            }
        }
        //hasDoubled = false;
    }
    else {
        this.crouchCounter = 0;

    }
    if (this.isSit && this.canLandCrouchSnd && this.player.body.touching.down) {
        this.sound.play('landCrouch');
        this.canLandCrouchSnd = false
    }
    if (!this.isSit) {
        this.canLandCrouchSnd = true
    }

    /*
    if(cameraShakePositive > 0){
        cameraShakePositive -= 1;
    }
    else{
        cameraShakeDirection = 0;
    }
    cameraShakeDirection = !cameraShakeDirection;
    if (cameraShakeDirection){
        cameraShake = 0 - cameraShakePositive;
    }
    else{
        cameraShake = cameraShakePositive;
    }
    camera.setPosition(cameraShake, camera.y);
    */

    //dynamite spawn

    if (this.dyna) {
        this.dyna.angle += 5;
        if (this.dyna.body && this.dyna.body.touching.down) {
            this.dyna.destroy();
            flash.setAlpha(1);
            this.sound.play('boom');
            cameraShakePositive = 50;
            for (let c in this.cactusT) {
                this.cactusT[c].isDyna = true;
            }
            for (let p in this.pteroT) {
                this.pteroT[p].isDyna = true;
            }
        }

        if (flash.alpha > 0) {
            flash.setAlpha(flash.alpha - 0.1);
            flash.depth = 999999;
        }
        else {
            flash.setAlpha(0);
        }

    }

    for (let c in this.cactusT) {
        if (this.cactusT[c]) {
            let cact = this.cactusT[c];
            if (cact.hasLanded) {
                if (cact.isDyna && cact.x > this.config.gameOptions.playerStartPosition) {
                    cact.x += 4;
                }
                else {
                    cact.x -= 4;
                }
                if (cact.x < 0) {
                    this.cactusT[c].destroy();
                    delete this.cactusT[c];
                    this.cactusT = this.cactusT.filter(function (ct) { if (ct) { return true } });
                }
            }
        }
    }

    for (let p in this.pteroT) {
        let pte = this.pteroT[p];
        if (pte.isDyna && pte.x > this.config.gameOptions.playerStartPosition) {
            pte.flipX = true;
            pte.x += pte.speed;
        }
        else {
            pte.x -= pte.speed;
        }
    }

    for (c in this.cloudT) {
        let clou = this.cloudT[c]; {
            clou.x -= clou.speed;
        }
    }
    /*
    this.cloudDensSeed = getRandomRnd(1, this.config.gameOptions.cloudDensity + 1);
    if (this.cloudDensSeed === 1) {
        this.addCloud(this.config.gameConfig.width, getRandom(0, this.config.gameConfig.height - 100), getRandom(0.5, 2));
    }
    */


    /*
    CACTUS SPAWNING
    */
    this.waveType = getRandomRnd(0, 10)

    this.config.gameOptions.spawnDelay -= 0.1

    if (!this.canSpawn && !this.spawnTimeout) {
        this.spawnTimeout = setTimeout(function () {
            this.canSpawn = true;
            this.spawnTimeout = false;
        }, this.config.gameOptions.spawnDelay)
    };

    if (this.canSpawn) {
        this.canSpawn = false;
        let type = getRandomRnd(0, 4);
        switch (type) {
            case 0:
                this.addCactus(this.config.gameConfig.width, 550/*getRandom(600, 600)*/, 1, 0.1, 0);
                break;
            case 1:
                this.addCactus(this.config.gameConfig.width, getRandom(0, 700), 2, 1, 1);
                break;
            case 2:
                let randomSeed = this.config.gameOptions.pteroOffset;
                let randomOne;
                let randomTwo;
                if (this.player.y - randomSeed < 0) {
                    randomOne = 0
                }
                else {
                    randomOne = this.player.y - randomSeed
                }
                if (this.player.y + randomSeed > this.config.gameConfig.height) {
                    randomTwo = this.config.gameConfig.height
                }
                else {
                    randomTwo = this.player.y + randomSeed
                }
                this.addPtero(this.config.gameConfig.width, getRandom(randomOne, randomTwo), 1);
                break;
            case 3:
                this.addCactus(this.config.gameConfig.width, 550/*getRandom(600, 600)*/, getRandom(1.5, 2.5), 0.1, 2);
                break;
            /*case 3:
                this.addLife(this.config.gameConfig.width, getRandom(0, this.config.gameConfig.height), 1);
                break;*/
            default:
                console.log("ERROR SPAWN ENEMY");
        }
    }
}


}