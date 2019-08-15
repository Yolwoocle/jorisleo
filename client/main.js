var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('player', 'assets/player.png');
    this.load.image('ground', 'assets/tileGround.png');
}
var platforms
function create ()
{
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 590, 'ground').setScale(40, 1).refreshBody();

    var player = this.add.image(100, 555, 'player');
    player.displayWidth = 50;
    player.displayHeight = 50;
}

function update ()
{
}