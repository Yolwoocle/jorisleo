import Config from "./Config"
export default class Cactus extends Phaser.GameObjects.Sprite { 
    constructor(config) {
        console.log("cactusconstructor1")
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
                super(config.scene, config.posX, config.posY, 'stego');
                this.play('stego');
        }
        console.log("cactusconstructor2")
        this.create()
    }

    create() {
        console.log("cactuscreate")
        this.this.body.setGravityY(scene.config.gameConfig.physics.arcade.gravity.y);
    //      ^ à partir de là j'ai commencé à désespérer.
        this.physics.add.collider(this, this.groundLayer, function (cldPlayer, cldCactus) {
            this.hasLanded = true;
        });
        // this.physics.add.collider(cactus, this.groundLayer2);
        this.hasTouched = false;
        this.hasLanded = false;
        this.type = type
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
                this.setBounce(0.1);
                this.body.width /= 2;
            }
        })
        this.on('pointerover', function (pointer, localX, localY, event) {
            this.setAlpha(0.4);
        });
        this.on('pointerout', function (pointer, localX, localY, event) {
            this.setAlpha(1);
        });
        this.physics.add.overlap(this.player, this, function (cldPlayer, cldCactus) {
            if (!cldCactus.hasTouched) {
                cldCactus.hasTouched = true;
                scene.hitDino();
            }
        }, null, this);
        this.cactusT.push(this);
        /*switch(type){
            case 0:
                break;
            case 1:
                    cactus.body.width /= 2;
                break;
        }*/
    }

} 