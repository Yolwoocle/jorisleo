function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomRnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
} 

export default class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });

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
            spawnDelay: 750,
            spawnDelayDefault: 750,
            cloudDensity: 25,
        };
    
    
    
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
    }

preload()
{
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

create()
{
    this.add.text(0, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });

    platforms;
    cursors;
    player;
    map;
    groundLayer;
    obstacleGroup;
    groundLayer2;
    playerShadow;
    cactusT = [];
    pteroT = [];
    canCactus = true;
    life = 3
    hasCrouched = false;
    crouchCounter
    canDyna = true
    canPtero = true
    canDouble = false;
    canSpawn = true
    jumpCounter;
    score = 0;
    scene = this;
    this.groundLayer = this.physics.add.staticSprite(10, 590, 'blank');
    this.groundLayer.setSize(800, 10);
    this.groundLayer.body.immovable = true;
    groundLayer2 = this.add.tileSprite(400, 572, 1200, 25, 'ground');

    player = this.physics.add.sprite(gameOptions.playerStartPosition, 450, 'playerS2');
    player.depth = 100;
    playerShadow = this.add.sprite((gameOptions.playerStartPosition - 5), 580, 'playerShadow');
    playerShadow.depth = 1;
    playerShadow.alpha = 0.2;
    playerShadow.blendMode = 'MULTIPLY';

    player.play('playerJump');
    player.setSize(46, 49, true);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(config.physics.arcade.gravity.y);
    player.jumps = 0;
    player.isHit = false;
    player.isInvulnerable = false;
    hasClicked = false;
    this.physics.add.collider(player, this.groundLayer);
    player.setInteractive();
    player.on('pointerdown', function () {
        if (!hasClicked) {
            scene.jump();
            hasClicked = true
        }
    })

    this.jump = function () {
        jumpCounter += 1
        if (player.body.touching.down) {
            player.jumps = 0;
            jumpCounter = 1
        }
        if (!player.body.touching.down && hasCrouched && canDouble/*&& !hasDoubled*/) {
            player.jumps -= gameOptions.doubleJumpsMax;
            canDouble = false;
            //hasDoubled = true;
        }
        if (player.jumps < gameOptions.jumpNumber && !(crouchCounter > gameOptions.crouchJumpTime)) {
            player.jumps++;
            player.setVelocityY(-gameOptions.jumpVelocity);
            switch (jumpCounter) {
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
            player.play('playerJump');
        }
        if (player.jumps < -gameOptions.doubleJumpsMax) {
            player.jumps = -gameOptions.doubleJumpsMax;
        }
        if (!(keys.DOWN.isDown || keys.S.isDown) && crouchCounter > gameOptions.crouchJumpTime && player.body.touching.down) {
            player.setVelocityY(-gameOptions.jumpVelocity * 1.2);
            this.sound.play('jump1');
            jumpCounter -= 1
        }
    }

    keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keys.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keys.Y = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);



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
        cactus.body.setGravityY(config.physics.arcade.gravity.y);
        cactus.setBounce(bounce);
        cactus.scaleX = ratio;
        cactus.scaleY = ratio;
        this.physics.add.collider(cactus, this.groundLayer, function (cldPlayer, cldCactus) {
            cactus.hasLanded = true;
        });
        // this.physics.add.collider(cactus, groundLayer2);
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
        this.physics.add.overlap(player, cactus, function (cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        cactusT.push(cactus);
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
        ptero.body.setGravityY(-config.physics.arcade.gravity.y);
        ptero.hasTouched = false;
        ptero.speed = ratio + 6;
        this.physics.add.overlap(player, ptero, function (cldPlayer, cldPtero) {
            if (!cldPtero.hasTouched) {
                cldPtero.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        pteroT.push(ptero);
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
        cloud.body.setGravityY(-config.physics.arcade.gravity.y);
        cloudT.push(cloud);
        //this.physics.add.overlap(player, cloud, function(cldPlayer, cldPtero) {
        //}, null, this);
    }

    /*this.addLife = function(posX, posY, ratio) {
        let life = this.physics.add.sprite(posX, posY, 'life');
        life.play('life'); 
        life.body.setGravityY(-config.physics.arcade.gravity.y);
        life.hasTouched = false;
        life.speed = ratio + 6;
        this.physics.add.overlap(player, life, function(cldPlayer, cldlife) {
            if (!cldlife.hasTouched) {
                gameOptions.life += 1
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
        dyna = this.physics.add.sprite(posX, posY, 'dynamite');
        dyna.setCollideWorldBounds(true);
        dyna.body.setGravityY(dynaGravityY);
        this.physics.add.collider(dyna, this.groundLayer);
        dyna.setVelocityX(300);
        dyna.setVelocityY(-700);
        canDyna = false
        setTimeout(function () {
            canDyna = true
        }, gameOptions.dynaLimit)
        // console.log(dyna);
        //  angle;

    }

    this.hitDino = function () {
        if (!player.isHit) {
            player.play('playerHitA')
            this.sound.play('damage');
            life -= 1;
            player.isHit = true;
            setTimeout(function () {
                player.isHit = false;
            }, gameOptions.invu)
            console.log('Touché');
        }
    }

    flash = this.add.sprite(config.width / 2, config.height / 2, 'flash');
    flash.setAlpha(0);

    pointer = this.input.activePointer;
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


    console.log(player);
} 

update()
{
    if (config.debug) {
        gameOptions.life = 999999;
    }

    let scene = this;
    //PLAYER
    player.x = gameOptions.playerStartPosition;
    if (groundLayer2) {
        groundLayer2.tilePositionX += 4
    }

    playerShadow.alpha = (player.y / config.height) * 0.3;
    playerShadow.scaleX = ((player.y / config.height) * 0.5) + 0.7;
    playerShadow.scaleY = 0.5

    if (player.isHit) {
        if (player.alpha > 0.5) {
            player.alpha = 0.4;
        }
        else {
            player.alpha = 1;
        }
    }
    else {
        player.alpha = 1;
    }

    if (keys.DOWN.isDown || keys.S.isDown) {
        if (canSoundCrouch) {
            this.sound.play('crouch');
            canSoundCrouch = false;
        }
        if (!player.body.touching.down) {
            player.setTexture('playerSit');

            isSit = true;
            window.clearTimeout(sitTimeout);
            sitTimeout = setTimeout(function () {
                isSit = false;
            }, 200)
        }
        else {
            if (!isSit) {
                player.setTexture('playerCrouch');

            }
            else {
                if (canLandCrouchSnd) {
                    this.sound.play('landCrouch');
                    canLandCrouchSnd = false
                }
            }
        }
        //player.setTexture();
        player.body.setGravityY(10000);
        hasCrouched = true
    }
    else {
        player.body.setGravityY(config.physics.arcade.gravity.y);
        canSoundCrouch = true;
    }
    if (!(keys.DOWN.isDown || keys.S.isDown) && crouchCounter > gameOptions.crouchJumpTime) {
        this.jump();
        if (player.body.touching.down && crouchCounter > gameOptions.dynaSpawnTime && (!dyna || !dyna.body) && canDyna) {
            this.addDyna(player.x, player.y - 50);
        }
    }
    if (crouchCounter > gameOptions.dynaSpawnTime) {
        player.setTexture('playerSitGift');
    }

    if (life == 0) {
        setTimeout(function () {
            scene.scene.restart();
            gameOptions.spawnDelay = gameOptions.spawnDelayDefault;
        }, 1200)
        this.scene.pause();
        player.setAlpha(1);
    }

    if (player.body.touching.down) {
        hasClicked = false
        hasCrouched = false;
        canDouble = true;
        if (keys.DOWN.isDown || keys.S.isDown) {
            crouchCounter++;
        }
        if (player.anims.currentAnim.key != 'playerWalk') {
            if (!isSit && !player.isHit) {
                player.play('playerWalk');
            }
        }
        //hasDoubled = false;
    }
    else {
        crouchCounter = 0;

    }
    if (isSit && canLandCrouchSnd && player.body.touching.down) {
        this.sound.play('landCrouch');
        canLandCrouchSnd = false
    }
    if (!isSit) {
        canLandCrouchSnd = true
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

    if (dyna) {
        dyna.angle += 5;
        if (dyna.body && dyna.body.touching.down) {
            dyna.destroy();
            flash.setAlpha(1);
            this.sound.play('boom');
            cameraShakePositive = 50;
            for (c in cactusT) {
                cactusT[c].isDyna = true;
            }
            for (p in pteroT) {
                pteroT[p].isDyna = true;
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

    for (c in cactusT) {
        if (cactusT[c]) {
            let cact = cactusT[c];
            if (cact.hasLanded) {
                if (cact.isDyna && cact.x > gameOptions.playerStartPosition) {
                    cact.x += 4;
                }
                else {
                    cact.x -= 4;
                }
                if (cact.x < 0) {
                    cactusT[c].destroy();
                    delete cactusT[c];
                    cactusT = cactusT.filter(function (ct) { if (ct) { return true } });
                }
            }
        }
    }

    for (p in pteroT) {
        let pte = pteroT[p];
        if (pte.isDyna && pte.x > gameOptions.playerStartPosition) {
            pte.flipX = true;
            pte.x += pte.speed;
        }
        else {
            pte.x -= pte.speed;
        }
    }

    for (c in cloudT) {
        let clou = cloudT[c]; {
            clou.x -= clou.speed;
        }
    }

    cloudDensSeed = getRandomRnd(1, gameOptions.cloudDensity + 1);
    if (cloudDensSeed === 1) {
        this.addCloud(config.width, getRandom(0, config.height - 100), getRandom(0.5, 2));
    }









    /*
    CACTUS SPAWNING
    */
    waveType = getRandomRnd(0, 10)

    gameOptions.spawnDelay -= 0.1

    if (!canSpawn && !spawnTimeout) {
        spawnTimeout = setTimeout(function () {
            canSpawn = true;
            spawnTimeout = false;
        }, gameOptions.spawnDelay)
    };

    if (canSpawn) {
        canSpawn = false;
        type = getRandomRnd(0, 4);
        switch (type) {
            case 0:
                this.addCactus(config.width, 550/*getRandom(600, 600)*/, 1, 0.1, 0);
                break;
            case 1:
                this.addCactus(config.width, getRandom(0, 700), 2, 1, 1);
                break;
            case 2:
                let randomSeed = gameOptions.pteroOffset;
                let randomOne;
                let randomTwo;
                if (player.y - randomSeed < 0) {
                    randomOne = 0
                }
                else {
                    randomOne = player.y - randomSeed
                }
                if (player.y + randomSeed > config.height) {
                    randomTwo = config.height
                }
                else {
                    randomTwo = player.y + randomSeed
                }
                this.addPtero(config.width, getRandom(randomOne, randomTwo), 1);
                break;
            case 3:
                this.addCactus(config.width, 550/*getRandom(600, 600)*/, getRandom(1.5, 2.5), 0.1, 2);
                break;
            /*case 3:
                this.addLife(config.width, getRandom(0, config.height), 1);
                break;*/
            default:
                console.log("ERROR SPAWN ENEMY");
        }
    }
}


}