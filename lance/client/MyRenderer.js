'use strict';

const Renderer = require('lance-gg').render.Renderer;

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        this.cervus = {};
        this.shapes = [];
        this.player_pawn = false;
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
            }
        }

        if (this.player_pawn) {
          console.log(this.player_pawn);
          this.cervus.world.camera_transform.position = [
            this.player_pawn.components.transform.position[0],
            this.cervus.world.camera_transform.position[1],
            this.player_pawn.components.transform.position[2] - 10
          ];
        }
    }

    addSprite(obj, objName) {
        if (objName === 'activeplayer') objName += obj.id;

        const element = this.sprites[obj.id];

        if (!element) {
          const player_spawning_position = this.cervus.board.get_random_empty_field();
          this.sprites[obj.id] = new cervus.Player({
            shape: this.shapes[0],
            world: this.cervus.world,
            board: this.cervus.board,
            options: {
              position: player_spawning_position,
              base_color: '#'+Math.floor(Math.random()*16777215).toString(16)
            }
          });

          if (this.clientEngine.isOwnedByPlayer(obj)) {
            this.player_pawn = this.sprites[obj.id];
          }
        }
    }

}

module.exports = MyRenderer;
