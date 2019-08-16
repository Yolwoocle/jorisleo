var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: "#f7f7f7"
};

var gameOptions = {
    jumpVelocity: 700,
    platformSpeed: 200,
    playerStartPosition: 100,
    jumpNumber: 2,
    cactusLimit: 800,
    pteroLimit: 500,
    dynaLimit: 10000,
    dynaSpawnTime: 50, //time in frames
    doubleJumpsMax: 2,
    invu: 1600
}

document.addEventListener('contextmenu', e => e.preventDefault());
var platforms, cursors, player, map, groundLayer, obstacleGroup, groundLayer2, playerShadow;
var cactusT = [];
var pteroT = [];
var canCactus = true;
var dyna;
var keys = {};
var pointer;
var life = 3;
var hasCrouched = false;
var crouchCounter
var canDyna = true
var canPtero = true
var canDouble = false

var game = new Phaser.Game(config);

function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
}

function preload ()
{
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
    this.load.image('ground', 'sprites/tileGround.png');
    this.load.image('cactusS1', 'sprites/cactusS1.png');
    this.load.image('cactusS2', 'sprites/cactusS2.png');
    this.load.image('cactusB1', 'sprites/cactusB1.png');
    this.load.image('cactusB2', 'sprites/cactusB2.png');
    this.load.image('dynamite', 'sprites/dynamite.png');
    this.load.image('flash', 'sprites/whiteFlash.png');
}

function create ()
{
    let scene = this;
    this.groundLayer = this.physics.add.staticGroup({
        key: 'ground',
        frameQuantity: 40
      });
      Phaser.Actions.PlaceOnLine(this.groundLayer.getChildren(),
        new Phaser.Geom.Line(10, 590, 810, 590));
      this.groundLayer.refresh();
    groundLayer2 = this.add.tileSprite(400,590,800,35, 'ground')

    player = this.physics.add.sprite(gameOptions.playerStartPosition, 450, 'playerS2');
    player.depth = 100;
    playerShadow = this.add.sprite((gameOptions.playerStartPosition - 5), 580, 'playerShadow');
    playerShadow.depth = 1;
    playerShadow.alpha = 0.2;
    playerShadow.blendMode = 'MULTIPLY'; 

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
    player.play('playerJump'); 
    player.setSize(46, 49, true);
      
    player.setCollideWorldBounds(true);
    player.body.setGravityY(config.physics.arcade.gravity.y);
    player.jumps = 0;
    player.isHit = false; 
    player.isInvulnerable = false; 
    this.physics.add.collider(player, this.groundLayer);

    this.jump = function () {  
        if (player.body.touching.down) {
            player.jumps = 0;
            
        }
        if (!player.body.touching.down && hasCrouched && canDouble/*&& !hasDoubled*/){
            player.jumps -= gameOptions.doubleJumpsMax;
            canDouble = false;
            //hasDoubled = true;
        }       
        if (player.jumps < gameOptions.jumpNumber && !(crouchCounter > 25)) {
            player.jumps++;
            player.setVelocityY(-gameOptions.jumpVelocity);
            player.play('playerJump'); 
        }
        if (player.jumps < -gameOptions.doubleJumpsMax){
            player.jumps = -gameOptions.doubleJumpsMax;
        }
        if (!(keys.DOWN.isDown || keys.S.isDown) && crouchCounter > 25 && player.body.touching.down){
            player.setVelocityY(-gameOptions.jumpVelocity*0.8);
        }
        hasCrouched = false;
    }

    keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 
    keys.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    keys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); 

    this.input.keyboard.on('keydown_UP', function() {
        scene.jump(); 
    });
    
    this.input.keyboard.on('keydown_Z', function() {
        scene.jump();
    });

    this.addCactus = function(posX) {
        let catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
        let cactus = this.physics.add.sprite(posX, 0, catT[Math.floor(Math.random() * 4)]);
        cactus.body.setGravityY(config.physics.arcade.gravity.y);
        cactus.setBounce(getRndInteger(0.5,0.9));
        this.physics.add.collider(cactus, this.groundLayer, function(cldPlayer, cldCactus) {
            cactus.hasLanded = true;
        });
        // this.physics.add.collider(cactus, groundLayer2);
        cactus.hasTouched = false;
        cactus.hasLanded = false;
        

        this.physics.add.overlap(player, cactus, function(cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        cactusT.push(cactus);
    }

    this.addPtero = function(posY) {
        let ptero = this.physics.add.sprite(800, posY, 'ptero');
        ptero.play('ptero'); 
        ptero.body.setGravityY(-config.physics.arcade.gravity.y);
        ptero.hasTouched = false;
        ptero.scaleY = 5;
        this.physics.add.overlap(player, ptero, function(cldPlayer, cldPtero) {
            if (!cldPtero.hasTouched) {
                cldPtero.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        pteroT.push(ptero);
    }

    //ADD DYNA
    this.addDyna = function(posX, posY) {
        var dynaGravityY = 500;
        dyna = this.physics.add.sprite(posX, posY, 'dynamite');
        dyna.setCollideWorldBounds(true);
        dyna.body.setGravityY(dynaGravityY);
        this.physics.add.collider(dyna, this.groundLayer);
        dyna.setVelocityX(300);
        dyna.setVelocityY(-700);
        canDyna = false
        setTimeout(function(){
            canDyna = true
        }, gameOptions.dynaLimit)
        // console.log(dyna);
        //var angle;

    }

    this.hitDino = function () {
        if (!player.isHit) {
            player.play('playerHitA')
            life -= 1;
            player.isHit = true; 
            setTimeout(function() {
                player.isHit = false; 
            }, gameOptions.invu)
            console.log('Touché');
        }
    }

    flash = this.add.sprite(config.width/2, config.height/2, 'flash');
    flash.setAlpha(0);
    
    pointer = this.input.activePointer;
    this.input.on('pointerup', function(pointer){
        switch (pointer.buttons) {
            case 1:
                if (canCactus) {
                    scene.addCactus((Math.random() * 200) + 600);
                    canCactus = false;
                    setTimeout(function() {
                        canCactus = true;
                    }, gameOptions.cactusLimit)
                } 
            break;
            case 2: 
                console.log('ptero');
                if (canPtero) {
                    scene.addPtero(pointer.worldY);
                    canPtero = false;
                    setTimeout(function() {
                        canPtero = true;
                    }, gameOptions.pteroLimit)
                } 
            break
        }
    })

    pointer = this.input.activePointer;


    console.log(player);
}

var isSitted = false;
var sitTimeout;

function update () {
    //PLAYER
    player.x = gameOptions.playerStartPosition;
    if (groundLayer2) { 
        groundLayer2.tilePositionX += 4
    }

    
    playerShadow.alpha = (player.y / config.height) * 0.5;
    playerShadow.scaleX = ((player.y / config.height) * 0.3) + 0.7;
    playerShadow.scaleY = 0.7

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
        if (!player.body.touching.down) {
            player.setTexture('playerSit'); 
            isSitted = true;
            window.clearTimeout(sitTimeout);
            sitTimeout = setTimeout(function() {
                isSitted = false;
            }, 200)
        }
        else {
            if (!isSitted) {
                player.setTexture('playerCrouch'); 
            }
        }
        //player.setTexture();
        player.body.setGravityY(10000);
        hasCrouched = true
    }
    else {
        player.body.setGravityY(config.physics.arcade.gravity.y);
    }
    if (!(keys.DOWN.isDown || keys.S.isDown) && crouchCounter > 25){
        this.jump();
        if (player.body.touching.down && crouchCounter > gameOptions.dynaSpawnTime && (!dyna || !dyna.body) && canDyna) {
            this.addDyna(player.x, player.y-50);
        }
    }
    if (crouchCounter > gameOptions.dynaSpawnTime){
        player.setTexture('playerSit')
    }

    if (life == 0) {
        this.scene.pause();
    }

    if (player.body.touching.down){
        hasCrouched = false; 
        canDouble = true;
        if (keys.DOWN.isDown || keys.S.isDown){
            crouchCounter++;
        }
        if(player.anims.currentAnim.key != 'playerWalk') {
            if (!isSitted && !player.isHit) {
                player.play('playerWalk'); 
            }
        }
        //hasDoubled = false;
    }
    else{
        crouchCounter = 0;
    }
    //dynamite spawn
    




    if (dyna) {
        dyna.angle += 5;
        if (dyna.body && dyna.body.touching.down) { 
            dyna.destroy();
            flash.setAlpha(1);
            cact.x = 0 - cact.x;
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
        let cact = cactusT[c];
        if (cact.hasLanded) {
            cact.x -= 4;
            if (cact.x < 0) {
                cactusT[c].destroy();
                delete cactusT[c];
            }
        }
    }

    for (p in pteroT) {
        let pte = pteroT[p];
        pte.x -= 6;
    }
} 