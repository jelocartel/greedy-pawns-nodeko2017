'use strict';

const Renderer = require('lance-gg').render.Renderer;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.cervus = {};
        this.shapes = [];
        this.player_pawn = false;
        this.lastBoard = '';
    }

    init() {
      return Promise.all(window.cervus.models).then(models => {
        this.shapes = models;
        this.cervus.world = new cervus.World();
        this.cervus.board = new cervus.Board({
          world: this.cervus.world
        });

        return super.init();
      });

    }

    draw() {
        super.draw();
        // console.log(this.gameEngine.world.objects)
        for (let objId of Object.keys(this.sprites)) {
          if (this.sprites[objId]) {
            this.sprites[objId].components.transform.position = [
              this.gameEngine.world.objects[objId].position.x,
              0,
              this.gameEngine.world.objects[objId].position.y
            ];

            this.sprites[objId].light_transform.position = [
              this.gameEngine.world.objects[objId].position.x,
              - 0.3,
              this.gameEngine.world.objects[objId].position.y
            ];
          }
        }

        const board_id = 1;
        if (this.gameEngine.world.objects[board_id] && this.lastBoard !== this.gameEngine.world.objects[board_id].board) {
          this.lastBoard = this.gameEngine.world.objects[board_id].board;
          const board = this.gameEngine.world.objects[board_id].getArray();
          if (board) {
            this.cervus.board.redraw_board(board, this.sprites);
          }
        }

        // console.log(board);
        if (this.player_pawn) {
          this.cervus.world.camera_transform.position = [
            this.player_pawn.components.transform.position[0],
            this.cervus.world.camera_transform.position[1],
            this.player_pawn.components.transform.position[2] - 10
          ];

          this.cervus.world.light_transform.position = [
            this.cervus.world.camera_transform.position[0],
            this.cervus.world.camera_transform.position[1] - 7,
            this.cervus.world.camera_transform.position[2],
          ];
        }
    }

    addSprite(obj, objName) {
        if (objName === 'activeplayer') objName += obj.id;

        const element = this.sprites[obj.id];

        if (!element) {
          // console.log(obj.position);
          //const player_spawning_position = this.gameEngine.board.get_random_empty_field();
          this.sprites[obj.id] = new cervus.Player({
            shape: this.shapes[obj.shape],
            scale: [
              cervus.scales[obj.shape],
              cervus.scales[obj.shape],
              cervus.scales[obj.shape]
            ],
            world: this.cervus.world,
            board: this.cervus.board,
            options: {
              position: obj.position,
              base_color: obj.color
            }
          });

          if (this.clientEngine.isOwnedByPlayer(obj)) {
            this.player_pawn = window.pawn = this.sprites[obj.id];
          }
        }
    }

}

module.exports = MyRenderer;
