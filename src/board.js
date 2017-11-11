import { CONFIG } from './config';
import { Plane } from 'cervus/shapes';
import { Render, Transform } from 'cervus/components';
import { PhongMaterial } from 'cervus/materials';

const board_options = CONFIG.board;

export class Board {
  constructor() {
    this.entity = new Plane();
    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render)
    };

    this.texture = document.createElement('canvas');
    this.ctx = this.texture.getContext('2d');
    this.texture.width = board_options.size * board_options.unit_size;
    this.texture.height = board_options.size * board_options.unit_size;

    this.material = new PhongMaterial({
      requires: [ Render, Transform ]
    });

    if (CONFIG.debug) {
      document.body.appendChild(this.texture);
      this.texture.style.position = 'absolute';
      this.texture.style.top = this.texture.style.left = '0px';
      this.texture.style.width = '250px';
      this.texture.style.height = '250px';
    }

    this.game = CONFIG.game;

    this.components.transform.scale = [
      board_options.size * board_options.scale,
      1,
      board_options.size * board_options.scale
    ];
    this.components.transform.position = board_options.position;
    this.components.render.material = this.material;
    this.components.render.color = board_options.colors[1];
    this.game.add(this.entity);

    this.generate_texture();
  }

  generate_texture() {
    for (let x = 0; x < board_options.size; x++) {
      for (let y = 0; y < board_options.size; y++) {
        this.ctx.fillStyle = board_options.colors[
          (x+y) % board_options.colors.length
        ];
        this.ctx.fillRect(
          x * board_options.unit_size,
          y * board_options.unit_size,
          board_options.unit_size,
          board_options.unit_size
        );
      }
    }

    this.apply_texture();
  }

  apply_texture(texture = this.texture) {
    this.material.texture = new Promise(resolve => {
      resolve(texture);
    });
  }
}
