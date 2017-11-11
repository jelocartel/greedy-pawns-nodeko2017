'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class ActivePlayer extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            color: { type: Serializer.TYPES.STRING }
        }, super.netScheme );
    }

    syncTo(other) {
        super.syncTo(other);
        this.color = other.color;
    }

    constructor(id, x, playerId) {
        super(id);
        this.position.set(x, 0);
        this.playerId = playerId;
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        console.log(this.color);
        this.class = ActivePlayer;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'activeplayer');
        }
    }
}
module.exports = ActivePlayer;
