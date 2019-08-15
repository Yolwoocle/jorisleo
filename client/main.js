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
    this.load.image('pigeon', 'assets/pigeon.png');
    this.load.image('ground', 'assets/tileGround.png');
}
var platforms
function create ()
{
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 590, 'ground').setScale(40, 1).refreshBody();

    var pigeon = this.add.image(100, 555, 'pigeon');
    pigeon.displayWidth = 50;
    pigeon.displayHeight = 50;
}

function update ()
{
}