
//import "phaser"
//import LoadAssets from './LoadAssets';
import GameScene from './GameScene';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
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
  platforms, cursors, player, map, groundLayer, obstacleGroup, groundLayer2, playerShadow;
  cactusT = [];
  pteroT = [];
  cloudT = [];
  lifeT = [];
  canCactus = true;
  dyna;
  keys = {};
  pointer;
  life = 3;
  hasCrouched = false;
  crouchCounter
  canDyna = true
  canPtero = true
  score
  canDouble = false;
  canSpawn = true
  jumpCounter

const game = new Phaser.Game(config); // eslint-disable-line no-unused-vars