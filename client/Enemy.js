import Config from "./Config"
//import "phaser"
export default class Enemy extends Phaser.GameObjects.Sprite { 
    constructor(config) {
        switch (config.type) {
            case 0:
                let catT = ['cactusS1', 'cactusS2', 'cactusB1', 'cactusB2'];
                super(config.scene, config.posX, config.posY, catT[Math.floor(Math.random() * 4)]);
                break;
            case 1:
                super(config.scene, config.posX, config.posY, 'cactusW1');
                this.play('cactusW1');
                break;
            case 2:
                super(config.scene, config.posX, config.posY, 'ptero');
                this.play('ptero');
                break;
            case 3:
                super(config.scene, config.posX, config.posY, 'stego')
                this.play('stego');
                break;
            case 4:
                super(config.scene, config.posX, config.posY, 'sphinxIdle')
                break;
        }
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.scene = config.scene;
        this.type = config.type;    
        this.hasTouched = false;
        this.hasLanded = false;
        this.setScale(config.ratio,config.ratio);
        this.body.setBounce(config.bounce);
        this.scene.physics.add.collider(this, this.groundLayer2);
        this.create();
    }

    create() {
        let scene = this.scene;
        let enemy = this;
        if (this.type === 2){
            this.body.setGravityY(-scene.config.gameConfig.physics.arcade.gravity.y);
            this.speed = this.ratio + 6;
        }else{
            this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
            scene.physics.add.collider(enemy, scene.groundLayer, function (cldPlayer, cldCactus) {
                enemy.hasLanded = true;
            });
        }
        this.setInteractive();
        this.on('pointerdown', function () {
            scene.sound.play('break');
            if (this.type !== 1) {
                this.destroy();
            }
            else {
                this.type = 0;
                this.body.setGravityY(10000);
                this.anims.stop();
                this.setTexture('cactusS1');
                this.body.bounce = 0.1;
                this.body.width = this.body.width / 2;

            }
        })
        this.on('pointerover', function (pointer, localX, localY, event) {
            enemy.setAlpha(0.4);
        });
        this.on('pointerout', function (pointer, localX, localY, event) {
            enemy.setAlpha(1);
        });

        scene.enemyT.push(enemy);
        
        scene.physics.add.overlap(scene.player, enemy, function (cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched && enemy.type !== 4) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, scene);
        
        /*switch(type){
            case 0:
                break;
            case 1:
                    cactus.body.width /= 2;
                break;
        }*/
    }
} 