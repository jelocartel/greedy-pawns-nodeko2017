import { CONFIG } from './config';
import { FloodFill } from './flood-fill';

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

  // redraw_board(colors, boundaries) {
  redraw_board(new_board_array, sprites) {
    // const new_board_array = this.flood_fill.compute_scene(
    //   chunk_array(this.array, boundaries)
    // );
    //
    // // console.log('chunk', chunk_array(this.array, boundaries));
    // // console.log('new array', new_board_array);
    new_board_array.forEach((arr, x) => {
      arr.forEach((value, y) => {
        const final_x = x;
        const final_y = y;
        if (value === this.array[final_x][final_y]) {
          return;
        }

        if (value !== 0) {
          // console.log('1', value);
          this.color_square(final_x, final_y, sprites[value].colors, false);
        } else {
          // console.log('2', value);
        }
      });
    });

    this.apply_texture();
  }

  mark_user_starting_filed(x, y, colors) {
   /*  let half_size = ~~(board_options.players_starting_field_size/2);
    for (let i = x - half_size; i < x + half_size + 1; i++) {
      for (let j = y - half_size; j < y + half_size + 1; j++) {
        this.color_square(i, j, colors, false);
      }
    }
    this.apply_texture();*/
  }

  /* get_random_empty_field() {
    let x = ~~(Math.random() * board_options.size);
    let y = ~~(Math.random() * board_options.size);
    while (this.array[x][y] !== 1) {
      x = ~~(Math.random() * board_options.size);
      y = ~~(Math.random() * board_options.size);
    }

    x -= CONFIG.board.size/2;
    y -= CONFIG.board.size/2;
    return {x, y};
  } */
}
