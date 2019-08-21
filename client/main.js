import "phaser"
import LoadAssets from './LoadAssets';
import GameScene from './GameScene';
import Config from './Config'


document.addEventListener('contextmenu', e => e.preventDefault());

const game = new Phaser.Game(Config.gameConfig); // eslint-disable-line no-unused-vars

/*GameScene.preload();
LoadAssets.preload();
GameScene.create();
GameScene.update();*/
