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
    platformSpeed: 10000,
    playerStartPosition: 100
}

var platforms, cursors, player, map, groundLayer;
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
    this.groundLayer = this.physics.add.staticGroup({
        key: 'ground',
        frameQuantity: 40
      });
      Phaser.Actions.PlaceOnLine(this.groundLayer.getChildren(),
        new Phaser.Geom.Line(10, 590, 810, 590));
      this.groundLayer.refresh();

    player = this.physics.add.sprite(gameOptions.playerStartPosition, 450, 'player');
    player.displayWidth = 50;
    player.displayHeight = 50;
    player.setCollideWorldBounds(true);
    player.body.setGravityY(config.physics.arcade.gravity.y);
    this.physics.add.collider(player, this.groundLayer);

    cactus = this.physics.add.sprite(10000, 450, 'cactusS1')
    cactus.setCollideWorldBounds(true);
    cactus.body.setGravityY(config.physics.arcade.gravity.y);
    cactus.setBounce(0.2);

    this.physics.add.collider(cactus, this.groundLayer);
    cactus.setVelocityX(gameOptions.platformSpeed * -1)
    
    this.physics.add.overlap(player, cactus, function() {
        console.log('Touché')
    }, null, this);
    
    pointer = this.input.activePointer;

    keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 

}

function update ()
{
    //PLAYER
    player.x = gameOptions.playerStartPosition;

    if (player.body.touching.down && keys.UP.isDown)
    {
        player.setVelocityY(-gameOptions.jumpVelocity);
    }
    if (keys.DOWN.isDown)
    {
        player.body.setGravityY(10000);
    }
    if (keys.DOWN.isUp)
    {
        player.body.setGravityY(config.physics.arcade.gravity.y);
    }

    //CACTUS
    
    if (pointer.isDown)
    {
        cactus.setX(750);
        cactus.setY(0);
    }

} 
