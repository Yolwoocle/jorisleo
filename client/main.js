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
var keys = {};
var pointer

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('player', 'sprites/playerJump1.png');
    this.load.image('ground', 'sprites/tileGround.png');
    this.load.image('cactusS1', 'sprites/cactusS1.png');
    this.load.image('cactusS2', 'sprites/cactusS2.png');
    this.load.image('cactusB1', 'sprites/cactusB1.png');
    this.load.image('cactusB2', 'sprites/cactusB2.png');
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

    if (cactus && cactus.body.touching.down) {
        cactus.setVelocityX(gameOptions.platformSpeed * -1)
    }

    //CACTUS
    
    if (pointer.isDown)
    {
    }

} 
