import { CONFIG } from './config';
import { FloodFill } from './flood_fill';

import { Plane } from 'cervus/shapes';
import { Render, Transform } from 'cervus/components';
import { PhongMaterial } from 'cervus/materials';


import { color_to_buffer, chunk_array } from './utils';

const board_options = CONFIG.board;

export class Board {
  constructor(options = {}) {
    this.world = options.world;

    this.array = window.array = [];
    this.flood_fill = new FloodFill();

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

    this.pixel_buffer = new Uint32Array(this.image_data.data.buffer);

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
      this.array[x] = [];
      for (let y = 0; y < board_options.size; y++) {
        this.array[x][y] = 1
        const color = board_options.colors[
          (x+y) % board_options.colors.length
        ];

        this.pixel_buffer[y * board_options.size + x] = color_to_buffer(color);
      }
    }

    this.ctx.putImageData(this.image_data, 0, 0);

    this.apply_texture();
  }

  color_square(x, y, colors, redraw = true) {
    this.array[x][y] = 0;

    const color = colors[Math.abs((x + y)%2)];

    this.pixel_buffer[y * board_options.size + x] = color_to_buffer(color);

    this.ctx.putImageData(this.image_data, 0, 0);

    if (redraw) {
      this.apply_texture();
    }
  }


  apply_texture(texture = this.texture) {
    this.material.texture = new Promise(resolve => {
      this.scaled_ctx.drawImage(
        texture,
        0, 0, this.scaled_texture.width, this.scaled_texture.height);
      resolve(this.scaled_texture);
    });
  }

  redraw_board(colors, boundaries) {
    const new_board_array = this.flood_fill.compute_scene(
      chunk_array(this.array, boundaries)
    );

    console.log('chunk', chunk_array(this.array, boundaries));
    new_board_array.forEach((arr, x) => {
      arr.forEach((value, y) => {
        const final_x = boundaries.min_x + x;
        const final_y = boundaries.min_y + y;
        if (value === this.array[final_x][final_y]) {
          return;
        }

        if (value === 0) {
          this.color_square(final_x, final_y, colors, false);
        }
      });
    });

    this.apply_texture();
  }
}
