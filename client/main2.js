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
    backgroundColor: "#000033"
};

var gameOptions = {
    jumpVelocity: 700
}

var platforms, cursors, player, map, groundLayer;
var keys = {};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('player', 'sprites/player.png');
    this.load.image('ground', 'sprites/tileGround.png');
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

    player = this.physics.add.sprite(100, 450, 'player');
    player.displayWidth = 50;
    player.displayHeight = 50;
    player.setCollideWorldBounds(true);
    player.body.setGravityY(config.physics.arcade.gravity.y);
    this.physics.add.collider(player, this.groundLayer);

    cactus = this.physics.add.sprite(450, 450, 'player')
    cactus.setCollideWorldBounds(true);
    cactus.body.setGravityY(config.physics.arcade.gravity.y);
    cactus.setBounce(0.2);
    

    keys.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keys.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); 

}

function update ()
{
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
} 
