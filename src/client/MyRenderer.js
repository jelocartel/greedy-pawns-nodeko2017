'use strict';

const Renderer = require('lance-gg').render.Renderer;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw() {
        super.draw();
        let players = '';
        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId].el) {
                this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].position.y + 'px';
                this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].position.x + 'px';
                players += JSON.stringify(this.gameEngine.world.objects[objId]) + ' player: ' + objId+'<br>';
            }
        }
        document.getElementById('players').innerHTML = players;
    }

    addSprite(obj, objName) {
        if (objName === 'activeplayer') objName += obj.id;

        let element = document.querySelector('#' + objName);

        if (!element) {
            let div = document.createElement('div');
            div.id = objName;
            div.setAttribute('class', 'user');
            document.querySelector(".screen").appendChild(div);
        }

        this.sprites[obj.id] = {
            el: document.querySelector('#' + objName)
        };
    }

}

module.exports = MyRenderer;
