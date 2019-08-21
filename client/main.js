import "phaser";
import LoadAssets from './LoadAssets';
import GameScene from './GameScene';
import Config from './Config'


document.addEventListener('contextmenu', e => e.preventDefault());

let config = new Config();
let gameConfig = Object.assign({}, config.gameConfig);
gameConfig.scene = [
    LoadAssets,
    GameScene
];

const game = new Phaser.Game(gameConfig);