import { CONFIG } from './config';
import { Plane } from 'cervus/shapes';
import { Render, Transform } from 'cervus/components';
import { PhongMaterial } from 'cervus/materials';

const board_options = CONFIG.board;

export class Board {
  constructor(options = {}) {
    this.world = options.world;

    this.entity = new Plane();
    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render)
    };

    this.texture = document.createElement('canvas');
    this.ctx = this.texture.getContext('2d');
    this.texture.width = board_options.size;
    this.texture.height = board_options.size;
    this.image_data = this.ctx.getImageData(0, 0, board_options.size, board_options.size);

    this.buffer = new ArrayBuffer(this.image_data.data.length);
    this.uint8_buffer = new Uint8ClampedArray(this.buffer);
    this.pixel_data = new Uint32Array(this.buffer);

    this.scaled_texture = document.createElement('canvas');
    this.scaled_ctx = this.scaled_texture.getContext('2d');
    this.scaled_texture.width = board_options.size * board_options.unit_size;
    this.scaled_texture.height = board_options.size * board_options.unit_size;
    this.scaled_ctx.imageSmoothingEnabled = false;

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

    this.game = this.world.game;

    this.components.transform.scale = [
      board_options.size * board_options.scale,
      1,
      board_options.size * board_options.scale
    ];
    this.components.transform.position = board_options.position;
    this.components.render.material = this.material;
    this.game.add(this.entity);

    this.generate_texture();
  }

  generate_texture() {
    for (let x = 0; x < board_options.size; x++) {
      for (let y = 0; y < board_options.size; y++) {
        const color = board_options.colors[
          (x+y) % board_options.colors.length
        ];

        this.pixel_data[y * board_options.size + x] =
          (255   << 24) |
          (color << 16) |
          (color <<  8) |
          color;
      }
    }

    this.image_data.data.set(this.uint8_buffer);
    this.ctx.putImageData(this.image_data, 0, 0);

    this.apply_texture();
  }

  apply_texture(texture = this.texture) {
    this.material.texture = new Promise(resolve => {
      this.scaled_ctx.drawImage(
        texture,
        0, 0, this.scaled_texture.width, this.scaled_texture.height);
      resolve(this.scaled_texture);
    });
  }
}
