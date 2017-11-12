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
        this.points_div = document.querySelector('div.points');
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
    roundEnd(e) {
      console.log('elo show');
    }

    roundStart(e) {
      console.log('elo hide');
    }

    show_points(points) {
      if (!points) {
        return;
      }
      
      points = JSON.parse(points);
      this.points_div.innerHTML = '';
      let output = '';
      Object.keys(points).sort(function(a, b) {
        return points[b] - points[a]
      }).forEach(player => {
        if (!this.gameEngine.world.objects[player]) {
          return;
        }
        output += `
          <div class="player" style="color:${this.gameEngine.world.objects[player].color}">
          ${player} - ${points[player]}
          </div>
          `;
      });

      this.points_div.innerHTML = output;
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

            if (this.sprites[objId].light) {
              this.sprites[objId].light_transform.position = [
                this.gameEngine.world.objects[objId].position.x,
                - 0.3,
                this.gameEngine.world.objects[objId].position.y
              ];
            }

          }
        }

        const board_id = 1;
        if (this.gameEngine.world.objects[board_id] && this.lastBoard !== this.gameEngine.world.objects[board_id].board) {
          this.show_points(this.gameEngine.world.objects[board_id].scoreTable);
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
          const isPlayer = this.clientEngine.isOwnedByPlayer(obj);
          this.sprites[obj.id] = new cervus.Player({
            shape: this.shapes[obj.shape],
            scale: [
              cervus.scales[obj.shape],
              cervus.scales[obj.shape],
              cervus.scales[obj.shape]
            ],
            world: this.cervus.world,
            board: this.cervus.board,
            do_light: isPlayer,
            options: {
              position: obj.position,
              base_color: obj.color
            }
          });

          if (isPlayer) {
            this.player_pawn = window.pawn = this.sprites[obj.id];
          }
        }
    }

}

module.exports = MyRenderer;
