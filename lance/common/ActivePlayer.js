'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class ActivePlayer extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            color: { type: Serializer.TYPES.STRING },
            boundaries: { type: Serializer.TYPES.STRING },
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
        this.boundaries = other.boundaries
    }

    constructor(id, x, y) {
      // console.log('active player', x, y, id);
        super(id);
        this.position.set(x, y);
        this.playerId = id;
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        this.lastX = this.lastY = 0;
        this.shape = 0;// ~~(Math.random()*2);
        this.class = ActivePlayer;
        x = Math.round(50 - x);
        y = Math.round(50 - y);
        this.boundaries = JSON.stringify({
            max_y: y,
            min_y: y,
            max_x: x,
            min_x: x
        })
    }
    setboundriesXY(x,y) {
        x = Math.round(50 - x);
        y = Math.round(50 - y);
        let pom = this.getBoundaries();
        //console.log('dupa ' + this.boundaries);
        if(!pom) return;
        if (x < pom.min_x) pom.min_x = x;
        if (x > pom.max_x) pom.max_x = x;
        if (y < pom.min_y) pom.min_y = y;
        if (y > pom.max_y) pom.max_y = y;
        this.boundaries = JSON.stringify(pom);
    }

    getBoundaries() {
        return JSON.parse(this.boundaries);
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'activeplayer');
        }
    }
}
module.exports = ActivePlayer;
