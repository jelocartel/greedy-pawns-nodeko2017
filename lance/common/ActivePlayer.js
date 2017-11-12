'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class ActivePlayer extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            color: { type: Serializer.TYPES.STRING },
            lastX: { type: Serializer.TYPES.FLOAT32 },
            lastY: { type: Serializer.TYPES.FLOAT32 },
            shape: { type: Serializer.TYPES.UINT8 }
        }, super.netScheme );
    }

    syncTo(other) {
        super.syncTo(other);
        this.color = other.color;
        this.lastX = other.lastX;
        this.lastY = other.lastY;
        this.shape = other.shape;
    }

    constructor(id, x, y) {
        super(id);
        this.position.set(x, y);
        this.playerId = id;
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        this.lastX = this.lastY = 0;
        this.shape = 0;// ~~(Math.random()*2);
        this.class = ActivePlayer;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'activeplayer');
        }
    }
}
module.exports = ActivePlayer;
