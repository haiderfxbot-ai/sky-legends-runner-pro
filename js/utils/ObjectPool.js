class ObjectPool {
    constructor(scene, createCallback, resetCallback, initialSize = 20) {
        this.scene = scene;
        this.createCallback = createCallback;
        this.resetCallback = resetCallback;
        this.pool = [];
        this.active = [];
        
        for (let i = 0; i < initialSize; i++) {
            const obj = this.createCallback();
            obj.setVisible(false);
            obj.setActive(false);
            this.pool.push(obj);
        }
    }

    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createCallback();
        }
        
        obj.setVisible(true);
        obj.setActive(true);
        this.active.push(obj);
        
        return obj;
    }

    getWithReset(...resetArgs) {
        const obj = this.get();
        if (this.resetCallback) {
            this.resetCallback(obj, ...resetArgs);
        }
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
        }
        
        obj.setVisible(false);
        obj.setActive(false);
        obj.setPosition(-100, -100);
        
        if (obj.body) {
            obj.body.enable = false;
        }
        
        this.pool.push(obj);
    }

    releaseAll() {
        while (this.active.length > 0) {
            this.release(this.active[0]);
        }
    }

    getActiveCount() {
        return this.active.length;
    }

    getPoolSize() {
        return this.pool.length;
    }

    getTotalCount() {
        return this.pool.length + this.active.length;
    }

    prewarm(count) {
        for (let i = 0; i < count; i++) {
            const obj = this.createCallback();
            obj.setVisible(false);
            obj.setActive(false);
            this.pool.push(obj);
        }
    }
}

class SpritePool extends ObjectPool {
    constructor(scene, textureKey, initialSize = 20) {
        super(
            scene,
            () => scene.physics.add.sprite(-100, -100, textureKey),
            (sprite, x, y, scaleX = 1, scaleY = 1) => {
                sprite.setPosition(x, y);
                sprite.setScale(scaleX, scaleY);
                sprite.body.enable = true;
                sprite.body.reset(x, y);
            },
            initialSize
        );
    }
}

class GroupPool {
    constructor(scene, textureKey, groupConfig = {}, initialSize = 20) {
        this.scene = scene;
        this.group = scene.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: initialSize,
            runChildUpdate: false,
            ...groupConfig
        });
        
        this.group.createMultiple({
            key: textureKey,
            quantity: initialSize,
            active: false,
            visible: false
        });
    }

    get(x, y, scaleX = 1, scaleY = 1) {
        const sprite = this.group.getFirstDead(false);
        if (sprite) {
            sprite.setActive(true);
            sprite.setVisible(true);
            sprite.setPosition(x, y);
            sprite.setScale(scaleX, scaleY);
            sprite.body.enable = true;
            sprite.body.reset(x, y);
            return sprite;
        }
        return this.group.create(x, y);
    }

    release(sprite) {
        sprite.setActive(false);
        sprite.setVisible(false);
        sprite.body.enable = false;
    }

    releaseAll() {
        this.group.getChildren().forEach(sprite => {
            this.release(sprite);
        });
    }

    getActiveCount() {
        return this.group.getChildren().filter(s => s.active).length;
    }

    getGroup() {
        return this.group;
    }
}

class TextPool extends ObjectPool {
    constructor(scene, style = {}, initialSize = 20) {
        super(
            scene,
            () => scene.add.text(-100, -100, '', style),
            (text, x, y, value) => {
                text.setPosition(x, y);
                text.setText(value);
            },
            initialSize
        );
    }
}

class ContainerPool extends ObjectPool {
    constructor(scene, initialSize = 20) {
        super(
            scene,
            () => scene.add.container(-100, -100),
            (container, x, y) => {
                container.setPosition(x, y);
            },
            initialSize
        );
    }
}
