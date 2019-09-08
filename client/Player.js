let scene

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(config) {
        scene = config.scene
        super(scene, scene.config.gameOptions.playerStartPosition, 450, 'playerS2');
        this.depth = 100; //Player's layer
        this.isSit = false;
        this.sitTimeout;
        this.isCrouch = false;
        this.distance = 0;
        this.jumps = 0;
        this.isHit = false;
        this.isInvulnerable = false;
        this.setupStuff();
    }

    setupStuff() {
        this.play('playerJump');
        this.setSize(46, 49, true);
        this.scene.physics.add.collider(this, scene.groundLayer);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
        this.setInteractive();
    }
}