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
    jumpNumber:3,
    cactusLimit: 800
}

var platforms, cursors, player, map, groundLayer, obstacleGroup, groundLayer2;
var cactus;
var canCactus = true;
var dyna;
var keys = {};
var pointer;
var life = 3;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('player', 'sprites/playerJump1.png');
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
    groundLayer2 = this.add.tileSprite(400,590,800,20, 'ground')

    player = this.physics.add.sprite(gameOptions.playerStartPosition, 450, 'player');
    player.displayWidth = 50;
    player.displayHeight = 50;
    player.setCollideWorldBounds(true);
    player.body.setGravityY(config.physics.arcade.gravity.y);
    player.jumps = 0;
    this.physics.add.collider(player, this.groundLayer);

    this.jump = function () {
        if (player.body.touching.down) {
            player.jumps = 0;
        }
        if (player.jumps < gameOptions.jumpNumber) {
            player.jumps++;
            player.setVelocityY(-gameOptions.jumpVelocity);
        }
    }

    this.addCactus = function(posX) {
        let catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
        cactus = this.physics.add.sprite(posX, 0, catT[Math.floor(Math.random() * 4)])
        cactus.body.setGravityY(config.physics.arcade.gravity.y);
        cactus.setBounce(Math.random());
        this.physics.add.collider(cactus, this.groundLayer);
        this.physics.add.collider(cactus, groundLayer2);
        cactus.hasTouched = false;
        
        this.physics.add.overlap(player, cactus, function(cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                console.log('Touché');
            }
        }, null, this);
    }

    this.addDyna = function(posX) {
        var dynaGravityY = 500;
        dyna = this.physics.add.sprite(posX, 0, 'dynamite')
        dyna.setCollideWorldBounds(true);
        dyna.body.setGravityY(dynaGravityY);
        this.physics.add.collider(dyna, this.groundLayer);
        console.log(dyna);
        //var angle;

    }

    flash = this.add.sprite(0, 0, 'flash');
    flash.displayWidth = config.width;
    flash.displayHeight = config.height;
    flash.setAlpha(0);
    
    this.physics.add.overlap(player, cactus, function() {
        life -= 1;
        console.log(life);
    }, null, this);
    
    pointer = this.input.activePointer;
    this.input.on('pointerdown', function(pointer){
        if (canCactus) {
            scene.addCactus((Math.random() * 200) + 600);
            canCactus = false;
            setTimeout(function() {
                canCactus = true;
            }, gameOptions.cactusLimit)
        }
    })

    pointer = this.input.activePointer;
    this.input.on('pointerup', function(pointer){
        scene.addDyna(750);
    })

    keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 

    this.input.keyboard.on('keydown_UP', function() {
        scene.jump();
    });
    
}

function update ()
{
    //PLAYER
    player.x = gameOptions.playerStartPosition;
    if (groundLayer2) { 
        groundLayer2.tilePositionX += 3
    }

    if (keys.DOWN.isDown)
    {
        player.body.setGravityY(10000);
    }
    if (keys.DOWN.isUp)
    {
        player.body.setGravityY(config.physics.arcade.gravity.y);
    }

    if (dyna) {
        dyna.angle += 5;
        if (dyna.body.touching.down) {
            dyna.destroy();
            flash.setAlpha(1);
            if (flash.alpha > 0) {
                flash.setAlpha(flash.alpha - 0.05);
                flash.depth = 999999;
                console.log("ok");
            }
            else {
                flash.setAlpha(0);
            }
        }
    } 
    if (cactus && cactus.body.touching.down) {
        cactus.setVelocityX(gameOptions.platformSpeed * -1)
    }

    //CACTUS
    
    if (pointer.isDown)
    {
    }


}
