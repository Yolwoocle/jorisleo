import LoadAssets from "./LoadAssets";
import Config from "./Config";
import Enemy from "./Enemy";


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
            frameRate: 10,
        });
        //this.add.text(0, 0, 'Subscribe to CaveUpdate on Twitter', { fontFamily: '"Roboto Condensed"' , color : '"black"' });

        this.cactusVelCounter = 0;
        this.camera;
        this.isSit = false;
        this.sitTimeout;
        this.spawnTimeout = false;
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
        this.canSpawn = true;
        this.groundLayer2;
        this.playerShadow;
        this.enemyT = [];
        this.canEnemy = true;
        this.life = 3
        this.hasCrouched = false;
        this.crouchCounter
        this.canDyna = true
        this.canDouble = false;
        
        this.jumpCounter;
        this.score = 0;
        this.cloudT = [];

        let scene = this;
        this.config = new Config();
        this.groundLayer = this.physics.add.staticSprite(10, 590, 'blank');
        this.groundLayer.setSize(1600, 10);
        this.groundLayer.body.immovable = true;
        this.groundLayer2 = this.add.tileSprite(400, 572, 1200, 25, 'ground');

        this.player = this.physics.add.sprite(this.config.gameOptions.playerStartPosition, 450, 'playerS2');
        this.player.depth = 100;
        this.playerShadow = this.add.sprite((this.config.gameOptions.playerStartPosition - 5), 580, 'playerShadow');
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

        this.addEnemy = function (posX, posY, ratio, bounce, type) {
            let catT;
            let enemy = new Enemy({
                scene: this,
                posX: posX, 
                posY: posY, 
                ratio: ratio, 
                bounce: bounce, 
                type: type
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
                this.player.play('playerHitA')
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
        if (this.config.gameConfig.physics.arcade.debug){
            this.life = 99999
        }

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
                window.clearTimeout(this.sitTimeout);
                this.sitTimeout = setTimeout(function () {
                    scene.isSit = false;
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
                scene.config.gameOptions.spawnDelay = scene.config.gameOptions.spawnDelayDefault;
            }, scene.config.gameOptions.spawnDelay)
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
                this.flash.setAlpha(1);
                this.sound.play('boom');
                this.cameraShakePositive = 50;
                for (let c in this.enemyT) {
                    this.enemyT[c].isDyna = true;
                }
            }

            if (this.flash.alpha > 0) {
                this.flash.setAlpha(this.flash.alpha - 0.1);
                this.flash.depth = 999999;
            }
            else {
                this.flash.setAlpha(0);
            }

        }

        this.cactusVelCounter += 0.001;        
        console.log(this.cactusVelCounter + " " + Math.cos(this.cactusVelCounter)*10)

        for (let c in this.enemyT) {
            if (this.enemyT[c]) {
                let enem = this.enemyT[c];
                if ((enem.hasLanded && (enem.type !== 2 || enem.type !== 1)) || (enem.type === 2 || enem.type === 1)) {
                    if (enem.isDyna && enem.x > this.config.gameOptions.playerStartPosition) {
                        enem.x += 4;
                        enem.flipX = true
                    }
                    else {
                        enem.x -= 4;
                    }
                    if (enem.x < 0) {
                        this.enemyT[c].destroy();
                        delete this.enemyT[c];
                        this.enemyT = this.enemyT.filter(function (ct) { if (ct) { return true } });
                    }
                }
                if (enem.type === 1) {
                    enem.y += this.cactusVelCounter;
                }
            }
        }

        

        for (let c in this.cloudT) {
            let clou = this.cloudT[c]; {
                clou.x -= clou.speed;
            }
        }

        this.cloudDensSeed = getRandomRnd(1, this.config.gameOptions.cloudDensity + 1);
        if (this.cloudDensSeed === 1) {
            this.addCloud(this.config.gameConfig.width, getRandom(0, this.config.gameConfig.height - 100), getRandom(0.5, 2));
        }

        /*
        CACTUS SPAWNING
        */

        //this.waveType = getRandomRnd(0, 10)

        this.config.gameOptions.spawnDelay -= 0.1

        if (!this.canSpawn && !this.spawnTimeout) {
            this.spawnTimeout = setTimeout(function () {
                scene.canSpawn = true;
                scene.spawnTimeout = false;
            }, this.config.gameOptions.spawnDelay)
        };
        /*
        Data values :
        0 - Normal cactus
        1 - winged cactus
        2 - Ptero
        3 - Stegosaurus 
        4 - UNUSED Sphinx
        */
        if (this.canSpawn) {
            this.canSpawn = false;
            let type = getRandomRnd(0, 3 +1); //changer le 3 à 4 pour avoir des sphinx.
            switch (type) {
                case 0:
                    this.addEnemy(this.config.gameConfig.width, 550, 1, 0.1, type);
                    break;
                case 1:
                    this.addEnemy(this.config.gameConfig.width, getRandom(0, 700), 2, 1, type);
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
                    this.addEnemy(this.config.gameConfig.width, getRandom(randomOne, randomTwo), 1, 0, type);
                    break;
                case 3:
                    this.addEnemy(this.config.gameConfig.width, 550, 2, 0.1, type);
                    break;
                case 4:
                    this.addEnemy(this.config.gameConfig.width, 550, 2, 0, type)
                default:
                    console.log("ERROR SPAWN ENEMY");
                    break;
            } 
        }
    }
}