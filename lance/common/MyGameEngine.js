'use strict';
const ActivePlayer = require('./ActivePlayer');
const Board = require('../common/Board');

const GameEngine = require('lance-gg').GameEngine;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.users = {};
        this.walking_speed = 0.0583;
    }

    start() {

        super.start();
        this.board = new Board(++this.world.idCount, 100);

        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('playerJoined', (joinTime, playerDesc)=>{
            let id = ++this.world.idCount;
            let position = this.board.get_random_empty_field();
            this.addObjectToWorld(new ActivePlayer(id, position.x, position.y));
            this.board.mark_user_starting_filed(position.x, position.y, id);
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
        serializer.registerClass(require('../common/ActivePlayer'));
        serializer.registerClass(Board);
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        // get the player paddle tied to the player socket
        let player = this.world.getPlayerObject(playerId);
        if (player) {
            if (inputData.input === 'up') {
                player.position.y -= this.walking_speed;
            } else if (inputData.input === 'down') {
                player.position.y += this.walking_speed;
            } else if (inputData.input === 'right') {
                player.position.x -= this.walking_speed;
            } else if (inputData.input === 'left') {
                player.position.x += this.walking_speed;
            }
        }
    }
}

module.exports = MyGameEngine;
