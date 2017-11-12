'use strict';

const ServerEngine = require('lance-gg').ServerEngine;
const Board = require('../common/Board');

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.players = {};
    }

    start() {
        super.start();
        const board = new Board(++this.gameEngine.world.idCount, 100, 3);
        this.gameEngine.addObjectToWorld(board);
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
