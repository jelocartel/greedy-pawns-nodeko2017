'use strict';
const ActivePlayer = require('./ActivePlayer');
const Board = require('../common/Board');

const GameEngine = require('lance-gg').GameEngine;
const PowerUps = require('./PowerUps');

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.users = {};
        this.walking_speed = 0.0583;
        this.prevStep = 0;
    }

    start() {
        super.start();
        // this.board = new Board(++this.world.idCount, 100, 3);
        // this.addObjectToWorld(this.board);
        this.on('playerJoined', (joinTime, playerDesc) => {
            let id = ++this.world.idCount;
            let position = this.world.objects[1].get_random_empty_field();
            this.addObjectToWorld(new ActivePlayer(id, position.x, position.y));
            this.world.objects[1].mark_user_starting_filed(position.x, position.y, id);
            console.log('boundrisy do min i maxa dodaj kurwa')
        });
        
        this.on('objectAdded', (object) => {
            this.users[object.id] = object;

        });

        this.on('server__processInput', (input, playerId) => {

            //console.log('chuj' + playerId);

            let player = this.world.getPlayerObject(playerId);
            if (player) {
                player.setboundriesXY(player.position.x, player.position.y);
            }
        });
        this.powerUps = new PowerUps();
    }

    initGame() {
    }

    postStepHandleBall() {
        if (!this.ball)
            return;

    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/ActivePlayer'));
        serializer.registerClass(require('../common/Board'));
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        // get the player paddle tied to the player socket
        let player = this.world.getPlayerObject(playerId);
        if (player && !player.bot) {
            if (inputData.input === 'up' && player.position.y > -49) {
                player.position.y -= this.walking_speed;
            } else if (inputData.input === 'down' && player.position.y < 50) {
                player.position.y += this.walking_speed;
            } else if (inputData.input === 'right' && player.position.x > -49) {
                player.position.x -= this.walking_speed;
            } else if (inputData.input === 'left' && player.position.x < 50) {
                player.position.x += this.walking_speed;
            }
            // console.log('player [x, y, id]', player.position.x, player.position.y, playerId);
            // console.log(this.world.objects[1])
            // if (!this.world.objects[1].board) return;
            player.setboundriesXY(player.position.x, player.position.y);
            this.world.objects[1].setVal(player.position.x, player.position.y, playerId);

            // snap to grid - sounds good, doesn't work.
            // if (player.lastX === player.position.x) {
            //   player.position.x = Math.round(player.position.x);
            // } else {
            //   player.lastX = player.position.x;
            // }
            //
            // if (player.lastY === player.position.y) {
            //   player.position.y = Math.round(player.position.y);
            // } else {
            //   player.lastY = player.position.y;
            // }
        }
    }

    create_power_up(player) {
        var position = this.board.draw_power_up_position();
        var improvement = this.powerUps.set_powerup_type();
        // add power up to board....

        // on user colision with powerUp
        //this.powerUps.give_player_powerup(player, improvement);
    }
}

module.exports = MyGameEngine;
