const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('./MyRenderer');

class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        this.serializer.registerClass(require('../common/PlayerAvatar'));
        this.gameEngine.on('client__preStep', this.preStep.bind(this));

        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            space: false
        };

        this.key_map = {
          40: 'up',
          38: 'down',
          37: 'left',
          39: 'right'
        };

        let that = this;
        document.onkeydown = (e) => { that.onKeyChange(e, true); };
        document.onkeyup = (e) => { that.onKeyChange(e, false); };
    }

    // our pre-step is to process all inputs
    preStep() {

        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true });
        }

        if (this.pressedKeys.down) {
            this.sendInput('down', { movement: true });
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
        }
    }

    onKeyChange(e, isDown) {
        e = e || window.event;
        this.pressedKeys[this.key_map[e.keyCode]] = isDown;
    }
}

module.exports = MyClientEngine;
