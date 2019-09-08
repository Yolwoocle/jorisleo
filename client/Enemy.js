import Config from "./Config"

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomRnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
    Data values :
    0 - Normal cactus
    1 - Winged cactus
    2 - Ptero
    3 - Stegosaurus 
    4 - -UNUSED- Sphinx
    5 - Geyser
    6 - TestBrick
*/


export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.thescene, config.posX, config.posY, config.texture);
        
        console.log("debug2")
        
        switch (config.type) {
            //DEV NOTE : Replace numbers by names
            case 0:
                
                
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
                super(config.scene, config.posX, config.posY, 'stego');
                this.play('stego');
                break;
            case 4:
                super(config.scene, config.posX, config.posY, 'sphinxIdle');
                this.play('sphinxIdle')
                break;
            case 5:
                super(config.scene, config.posX, config.posY, 'spikeBall');
                break;
            case 6:
                super(config.scene, 0, config.posY, 'sphinxLaser');
                break;
        }
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.scene = config.scene;
        this.type = config.type;
        this.hasTouched = false;
        this.hasLanded = false;
        this.setScale(config.ratio, config.ratio);
        this.body.setBounce(config.bounce);//DEV NOTE remove this, it's becomen useless
        this.scene.physics.add.collider(this, this.groundLayer2);
        this.gravityType = 0
        if (this.type === 5) {
            this.geyser = {
                vel: -10,
                height: 600,//this.scene.gameConfig.height;
                maxHeight: getRandomRnd(150, 400),
                triggerX: /*getRandomRnd(*/this.scene.config.gameConfig.width / 1.5/*, this.scene.config.gameConfig.width - 200)*/,
            }
        }
        
        let scene = this.scene;
        let enemy = this;
        if (this.type === 2 || this.type === 1 || this.type === 5 || this.type === 6) { //DEV NOTE 
            this.body.setGravityY(-scene.config.gameConfig.physics.arcade.gravity.y);
            this.gravityType = 1
        } else {
            this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
            scene.physics.add.collider(enemy, scene.groundLayer, function (cldPlayer, cldCactus) {
                enemy.hasLanded = true;
            });
        }
        this
        this.setInteractive();
        this.on('pointerdown', function () {
            scene.sound.play('break');
            if (this.type !== 1) {
                this.destroy();
            }
            else {
                this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
                this.anims.stop();
                this.setTexture('cactusS1');
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
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, scene);
    }

    /*create() {
        let scene = this.scene;
        let enemy = this;
        if (this.type === 2 || this.type === 1 || this.type === 5) {
            this.body.setGravityY(-scene.config.gameConfig.physics.arcade.gravity.y);
            this.gravityType = 1
        } else {
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
                this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
                this.anims.stop();
                this.setTexture('cactusS1');
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
            if (!cldCactus.hasTouched) {
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
        }
    }*/
} 