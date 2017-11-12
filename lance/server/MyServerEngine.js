'use strict';

const ServerEngine = require('lance-gg').ServerEngine;
const Board = require('../common/Board');
const ActivePlayer = require('../common/ActivePlayer');

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.players = {};
    }

    start() {
        super.start();
        const board = new Board(
          ++this.gameEngine.world.idCount,
          100,
          3,
          JSON.stringify((new Array(100)).fill((new Array(100)).fill(0)))
        );
        this.gameEngine.addObjectToWorld(board);

        for (let x = 0; x < 2; x++) {
          const id = ++this.gameEngine.world.idCount;
          const position = this.gameEngine.world.objects[1].get_random_empty_field();
          const bot = new ActivePlayer(id, position.x, position.y);
          this.gameEngine.addObjectToWorld(bot);
          bot.attachAI(this.gameEngine.world);
          this.gameEngine.world.objects[1].mark_user_starting_filed(position.x, position.y, id);
        }

        this.gameEngine.initGame();
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        this.players[socket.id] = { id: socket.playerId };
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        delete this.players[socketId];
        console.log('Player' + playerId + 'disconnected');
    }
}

module.exports = MyServerEngine;
