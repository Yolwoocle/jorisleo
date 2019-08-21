import "phaser"
import LoadAssets from './LoadAssets';
import GameScene from './GameScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true,
        }
    },
    pixelArt: true,
    scene: [
        LoadAssets,
        GameScene
    ],
    backgroundColor: "#f7f7f7"
};

document.addEventListener('contextmenu', e => e.preventDefault());

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars