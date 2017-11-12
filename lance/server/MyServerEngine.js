'use strict';

const ServerEngine = require('lance-gg').ServerEngine;
const Board = require('../common/Board');
const ActivePlayer = require('../common/ActivePlayer');

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.players = {};
        this.prevStep = 0;
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

        for (let x = 0; x < 3; x++) {
          const id = ++this.gameEngine.world.idCount;
          const position = this.gameEngine.world.objects[1].get_random_empty_field();
          const bot = new ActivePlayer(id, position.x, position.y);
          this.gameEngine.addObjectToWorld(bot);
          bot.attachAI(this.gameEngine.world);
          this.gameEngine.world.objects[1].mark_user_starting_filed(position.x, position.y, id);
        }

        this.gameEngine.on('server__preStep', (step) => {
            if((600+ this.prevStep -step)%10 === 0) this.io.sockets.emit('timeUpdate', 600 + this.prevStep - step);
            if ((step - this.prevStep) < 600) {
                return;
            } else if((step-this.prevStep) == 600){
                this.io.sockets.emit('roundEnd',{});
                //console.log('Chuj Ci w dupe stara dziwo!');
                //this.world.objects[1];// to jest kurwa Border Panie
                
                for (let objId of Object.keys(this.gameEngine.world.objects)) {
                    if (objId == 1) continue;
                    //console.log( this.world.objects[objId].getBoundaries());
                    this.gameEngine.world.objects[1].compute_scene(objId, this.gameEngine.world.objects[objId].getBoundaries());
                    this.gameEngine.world.objects[1].get_score(objId, this.gameEngine.world.objects[objId].getBoundaries());
                } 
            } else if((step-this.prevStep)>650){
                this.prevStep = step;
                this.io.sockets.emit('roundStart', {});
            }
        });

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
