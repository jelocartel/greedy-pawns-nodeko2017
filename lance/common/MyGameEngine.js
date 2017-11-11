'use strict';
const ActivePlayer = require('./ActivePlayer');

const GameEngine = require('lance-gg').GameEngine;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.users = {};
    }

    start() {

        super.start();
        
        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('playerJoined', (joinTime, playerDesc)=>{
            let id = ++this.world.idCount;
            this.addObjectToWorld(new ActivePlayer(id, id*10, id));
        });
        this.on('objectAdded', (object) => {
            this.users[object.id] = object;
        });
    }

    initGame() {
    }

    postStepHandleBall() {
        if (!this.ball)
            return;

    }

    registerClasses(serializer) {
        //serializer.registerClass(require('../common/ActivePlayer'));
    }

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);
        // get the player paddle tied to the player socket
        let playerPaddle = this.world.getPlayerObject(playerId);
        if (playerPaddle) {
            if (inputData.input === 'up') {
                playerPaddle.position.y -= 5;
            } else if (inputData.input === 'down') {
                playerPaddle.position.y += 5;
            }
        }
    }
}

module.exports = MyGameEngine;
