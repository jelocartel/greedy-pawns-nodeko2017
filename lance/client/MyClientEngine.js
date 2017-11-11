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
    }

    onKeyChange(e, isDown) {
        e = e || window.event;
        console.log(e);
        if (e.keyCode == '38') {
            this.pressedKeys.up = isDown;
        } else if (e.keyCode == '40') {
            this.pressedKeys.down = isDown;
        }
    }
}

module.exports = MyClientEngine;
