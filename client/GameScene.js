import LoadAssets from "./LoadAssets";
import Config from "./Config";
import Enemy from "./Enemy";
import LevelLayout from "./LevelLayout"
import Cactus from "./Cactus"
import Player from "./Player"


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

    preload() {
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

        //No idea what this does
        audio: {
            disableWebAudio: false
        }
    }

    create() {
        this.anims.create({
            key: "playerWalk",
            frames: this.anims.generateFrameNumbers("playerWalk"),
            frameRate: 10,
            repeat: -1
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
        this.anims.create({
            key: "playerJump",
            frames: this.anims.generateFrameNumbers("playerJump"),
            frameRate: 5,
        });
        this.anims.create({
            key: "sphinxIdle",
            frames: this.anims.generateFrameNumbers("sphinxIdle"),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "sphinxAttack",
            frames: this.anims.generateFrameNumbers("sphinxAttack"),
            frameRate: 2,
        });
        this.anims.create({
            key: "brickRotateTest",
            frames: this.anims.generateFrameNumbers("brickRotateTest"),
            frameRate: 20,
            repeat: -1
        });
        //this.add.text(0, 0, 'This is cool !', { fontFamily: '"Roboto Condensed"' , color : '"black"' });

        /*
        DEV NOTE : Please migrate player or specific object-related variables like isSit to the class itself
        */

        let scene = this;

        this.cactusVelCounter = 0;
        this.camera;
        this.spawnTimeout = false;
        this.waveType = 0;
        this.canSoundCrouch;
        this.canLandCrouchSnd;
        this.cloudDensSeed = 0;
        var platforms;
        var cursors;
        this.player;
        var map;
        var groundLayer;
        var obstacleGroup;
        this.canSpawn = false;
        this.groundLayer2;
        this.playerShadow;
        this.enemyT = [];
        this.geyserRectangleT = [];
        this.canEnemy = true;
        this.life = 3;
        this.hasCrouched = false;
        this.crouchCounter;
        this.canDyna = true;
        this.canDouble = false;
        this.speed = 6
        this.jumpCounter;
        this.score = 0;
        this.cloudT = [];

        let lvlLyt = new LevelLayout;
        this.levelLayout = lvlLyt.levelLayout;
        this.lvlLi = 0;

        //CREATE GROUND
        //groundLayer : actual physical ground
        //groundLayer2 : visual
        
        
        this.config = new Config();
        this.groundLayer = this.physics.add.staticSprite(10, this.config.gameConfig.height - 10, 'blank');
        this.groundLayer.setSize(1600, 10);
        this.groundLayer.body.immovable = true;
        this.groundLayer2 = this.add.tileSprite(400, 572, 1200, 25, 'ground');

        //Create player
        this.player = new Player({
            scene: this,
        });

        this.life = 3;
        //this.player.setCollideWorldBounds(true);
        this.distanceOffset = 0

        //Create Player shadow
        this.playerShadow = this.add.sprite((this.config.gameOptions.playerStartPosition - 5), 585, 'playerShadow');
        this.playerShadow.depth = -1;
        this.playerShadow.alpha = 0.3;
        this.playerShadow.blendMode = 'MULTIPLY'; //No idea what this does but without it it doesn't work

        //Jump function
        this.jump = function () {
            this.jumpCounter += 1
            //Reset jump counter when landing on ground
            if (this.player.body.touching.down) {
                this.player.jumps = 0;
                this.jumpCounter = 1
            }
            //s
            if (!this.player.body.touching.down && this.hasCrouched && this.canDouble/*&& !hasDoubled*/) {
                this.player.jumps -= this.config.gameOptions.doubleJumpsMax;
                this.canDouble = false;
                //hasDoubled = true;
            }
            //Player's jump
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
                this.player.play('playerJump');
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

        this.addEnemy = function (posY, ratio, bounce, type) {
            /*let enemy = new Enemy({
                scene: this,
                posX: this.config.gameConfig.width,
                posY: posY,
                ratio: ratio,
                bounce: bounce,
                type: type
            });*/
            let enemy = new Cactus({
                scene: this,
                posX: this.config.gameConfig.width,
                posY: posY,
                ratio: ratio,
                bounce: bounce,
                type: type
            })
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
            cloud.speed = ratio * 2 * (this.speed / 4);
            cloud.setScale(ratio, ratio);
            cloud.body.setGravityY(-this.config.gameConfig.physics.arcade.gravity.y);
            this.cloudT.push(cloud);
            //this.physics.add.overlap(this.player, cloud, function(cldPlayer, cldPtero) {
            //}, null, this);
        }

        //ADD DYNA
        this.addDyna = function (posX, posY) {
            this.dynaGravityY = 500;
            this.dyna = this.physics.add.sprite(posX, posY, 'dynamite');
            this.dyna.setCollideWorldBounds(true);
            this.dyna.body.setGravityY(this.dynaGravityY);
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
                if (!this.isSit || !this.isCrouch) {
                    this.player.play('playerHitA')
                }
                this.sound.play('damage');
                this.life -= 1;
                this.player.isHit = true;
                setTimeout(function () {
                    scene.player.isHit = false;
                }, this.config.gameOptions.invu)
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
    }

    update() {
        if (this.config.gameConfig.physics.arcade.debug) {
            this.life = 99999
        }

        let scene = this;
        //PLAYER
        this.player.x = this.config.gameOptions.playerStartPosition;
        if (this.groundLayer2) {
            this.groundLayer2.tilePositionX += this.speed
            this.player.distance += this.speed
        }

        this.playerShadow.alpha = (this.player.y / this.config.gameConfig.height) * 0.3;
        this.playerShadow.scaleX = ((this.player.y / this.config.gameConfig.height) * 0.5) + 0.7;
        this.playerShadow.scaleY = 0.5
        //this.playerShadow.x = (this.player.x - 12) + (-this.player.y + this.config.gameConfig.height) * 0.2

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
            this.player.isCrouch = true
            if (this.canSoundCrouch) {
                this.sound.play('crouch');
                this.canSoundCrouch = false;
            }
            if (!this.player.body.touching.down) {
                this.player.setTexture('playerSit');
                this.player.isSit = true;
                window.clearTimeout(this.player.sitTimeout);
                //this.player.sitTimeout = setTimeout(function () {

                //}, 4)
            }
            else {
                if (!this.player.isSit) {
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
            this.player.isCrouch = false
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
        if (scene.player.isSit && !(this.keys.DOWN.isDown || this.keys.S.isDown)) {
            scene.player.isSit = false;
        }
        if (this.life == 0) {
            setTimeout(function () {
                scene.scene.restart();
                scene.config.gameOptions.spawnDelay = scene.config.gameOptions.spawnDelayDefault;
            }, scene.config.gameOptions.spawnDelay)
            this.scene.pause();
            this.player.setAlpha(1);
        }

        if (this.player.body.touching.down) {
            this.hasCrouched = false;
            this.canDouble = true;
            if (this.keys.DOWN.isDown || this.keys.S.isDown) {
                this.crouchCounter++;
            }
            if (this.player.anims.currentAnim.key != 'playerWalk') {
                if (!this.player.isSit && !this.player.isHit) {
                    this.player.play('playerWalk');
                }
            }
        }
        else {
            this.crouchCounter = 0;
        }
        if (this.player.isSit && this.canLandCrouchSnd && this.player.body.touching.down) {
            this.sound.play('landCrouch');
            this.canLandCrouchSnd = false
        }
        if (!this.player.isSit) {
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
                this.flash.setAlpha(1);
                this.sound.play('boom');
                this.cameraShakePositive = 50;
                for (let c in this.enemyT) {
                    this.enemyT[c].isDyna = true;
                }
            }

            if (this.flash.alpha > 0) {
                this.flash.alpha -= 0.05;
                this.flash.depth = 999999;
            }
            else {
                this.flash.setAlpha(0);
            }
        }

        //Winged cactus vel counter (see below)
        this.cactusVelCounter += 0.1;

        //Cycle through every enemy in the enemyT array
        for (let c in this.enemyT) {
            if (this.enemyT[c]) {
                let enem = this.enemyT[c];
                if ((enem.hasLanded && enem.gravityType !== 1) || enem.gravityType === 1) {
                    //If a dynamite is active, destroy the enemy
                    if (enem.isDyna) {
                        this.enemyT[c].destroy();
                        delete this.enemyT[c];
                        this.enemyT = this.enemyT.filter(function (ct) { if (ct) { return true } });
                    }
                    //If not, make them move to the left
                    else {
                        enem.x -= this.speed;
                    }
                    //Delete enemy after reaching border
                    if (enem.x < 0 || enem.x > this.config.gameConfig.width || enem.y < 0 || enem.y > this.config.gameConfig.height) {
                        this.enemyT[c].destroy();
                        delete this.enemyT[c];
                        this.enemyT = this.enemyT.filter(function (ct) { if (ct) { return true } });
                    }
                }
                //Make winged cactuses move up and down
                if (enem.type === 1) {
                    enem.y += Math.cos(this.cactusVelCounter) * 5;
                }
                //Geysers' code
                if (enem.type === 5 && enem.x < enem.geyser.triggerX) {
                    //If geyser's max height isn't reached, make it grow higher
                    if (enem.geyser.height > enem.geyser.maxHeight) {
                        enem.geyser.height -= 6
                    }

                    //Make the geyser ball go up if it's under the geyser's height, if not do the opposite 
                    if (enem.geyser.height < enem.y) {
                        enem.geyser.vel -= 1.8
                    }
                    else {
                        enem.geyser.vel += 1.8
                    }
                    enem.y += enem.geyser.vel;
                }
            }
        }

        //CLOUDS
        for (let c in this.cloudT) {
            let clou = this.cloudT[c]; {
                //Make them move
                clou.x -= clou.speed;
            }
            if (clou.x < 0 || clou.x > this.config.gameConfig.width) {
                clou.destroy();
                /*delete this.enemyT[c];
                this.enemyT = this.enemyT.filter(function (ct) { if (ct) { return true } });*/
            }
        }

        this.cloudDensSeed = getRandomRnd(1, (this.config.gameOptions.cloudDensity / (this.speed / 4)) + 1);
        if (this.cloudDensSeed === 1) {
            this.addCloud(this.config.gameConfig.width, getRandom(0, this.config.gameConfig.height - 100), getRandom(0.5, 2));
        }

        //Enemy spawning

        //this.waveType = getRandomRnd(0, 10)

        /*
        Data values :
        0 - Normal cactus
        1 - Winged cactus
        2 - Ptero
        3 - Stegosaurus 
        4 - -UNUSED- Sphinx
        5 - Geyser
        6 - TestBrick
        */


        this.config.gameOptions.spawnDelay -= 0.1

        if (!this.canSpawn && this.levelLayout[this.waveType][this.lvlLi][1] <= this.player.distance-this.distanceOffset) {
            scene.canSpawn = true;
            scene.spawnTimeout = false;
            
        };

        console.log(this.levelLayout[this.waveType].length)

        if (this.canSpawn) {
            this.canSpawn = false;
            let type;
            type = this.levelLayout[this.waveType][this.lvlLi][0];
            if (this.lvlLi < this.levelLayout[this.waveType].length - 1) {
                this.lvlLi += 1;
            }
            else{
                let prevWT = this.waveType;
                //DEV NOTE : prevent repetition in waves
                this.waveType = getRandomRnd(0, this.levelLayout.length)
                this.lvlLi = 0
                this.distanceOffset = this.player.distance
            }

            this.addEnemy(550, 1, 0.1, 0);
            
            switch (type) {  
                case 'cactus':
                    this.addEnemy(550, 1, 0.1, 0);
                    break;
                case 'cactuswing':
                    this.addEnemy(getRandom(100, this.config.gameConfig.height), 2, 1, 1);
                    break;
                case 'ptero':
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
                    this.addEnemy(getRandom(randomOne, randomTwo), 1, 0, 2);
                    break;
                case 'stego':
                    this.addEnemy(550, 2, 0.1, 3);
                    break;
                case 'sphinx':
                    this.addEnemy(550, 2, 0, 4);
                    break;
                case 'geyser':
                    this.addEnemy(this.config.gameConfig.height - 30, 1, 0.1, 5);
                    let rect = this.add.rectangle(this.config.gameConfig.width, this.config.gameConfig.height - this.config.gameOptions.floorHeight, 0, 37);
                    this.geyserRectangleT.push(rect);
                    break;
                default:
                    if (this.levelLayout[this.lvlLi] !== []) {
                        console.log("ERROR SPAWN ENEMY");
                    }
                    break;
            }

        }
    }
}