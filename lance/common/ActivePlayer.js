'use strict';

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class ActivePlayer extends DynamicObject {

    constructor(id, x, playerId, time) {
        super(id);
        this.position.set(x, 0);
        this.playerId = playerId;
        this.time = time
        this.class = ActivePlayer;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'activeplayer');
        }
    }
}
module.exports = ActivePlayer;
