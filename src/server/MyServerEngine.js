'use strict';

const ServerEngine = require('lance-gg').ServerEngine;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
    }

    start() {
        super.start();

        this.gameEngine.initGame();

        this.players = {};
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
}

module.exports = MyServerEngine;
