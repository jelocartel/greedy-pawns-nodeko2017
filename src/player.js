import { CONFIG } from './config';

import { Render, Transform, Move, Light } from 'cervus/components';
import { Box } from 'cervus/shapes';
import { Entity } from 'cervus/core';
import { lighter_color } from './utils';
import { hex_to_rgb } from 'cervus/utils';

const default_options = {
  position: {
    x: 0,
    y: 3
  },
  base_color: 'FF00FF'
};

export class Player {
  constructor(options = {}) {
    this.options = {};

    Object.assign(this.options, default_options, options.options);

    this.base_color = this.options.base_color;
    this.colors = [
      hex_to_rgb(this.base_color),
      lighter_color(hex_to_rgb(this.base_color), -0.6)
    ];

    console.log('Michał, kurwa, napraw mnie', this.colors);
    this.world = options.world;
    this.board = options.board;

    this.lastX = 0;
    this.lastY = 0;
    this.last_colored = '';

    this.boundaries = {
      max_y: 0,
      min_y: Infinity,
      max_x: 0,
      min_x: Infinity
    };

    console.log(options.shape[0]);
    this.entity = new Entity({
      components: [
        new Transform({
          scale: [0.4, 0.4, 0.4]
        }),
        new Render({
          vertices: options.shape[0].vertices,
          indices: options.shape[0].indices,
          normals: options.shape[0].normals,
          material: this.world.material,
          color: this.base_color
        }),
        new Move({
          keyboard_controlled: true,
          rotate_speed: 0
        })
      ]
    });

    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render),
      move: this.entity.get_component(Move)
    };

    this.components.transform.position = [
      this.options.position.x,
      0,
      this.options.position.y
    ];

    this.board.mark_user_starting_filed(
      Math.round(((CONFIG.board.size)/2) - this.options.position.x),
      Math.round(((CONFIG.board.size)/2) - this.options.position.y),
      this.colors
    );
    this.world.camera_transform.position = [
      this.options.position.x,
      this.world.camera_transform.position[1],
      this.options.position.y - 10
    ];

    this.world.game.add(this.entity);

    this.light = new Entity({
      components: [
        new Transform(),
        new Light({
          color: this.base_color,
          intensity: 0.01
        })
      ]
    });
    this.light_transform = this.light.get_component(Transform);

    this.world.game.add(this.light);
  }

  end_round_calculations() {
    this.board.redraw_board(this.colors, this.boundaries);
  }

  on_tick() {
    const position = this.components.transform.position;

    if (this.lastX === position[0]) {
      this.components.transform.position = [
        Math.round(position[0]),
        position[1],
        position[2]
      ];
    } else {
      this.lastX = position[0];
    }

    if (this.lastY === position[2]) {
      this.components.transform.position = [
        position[0],
        position[1],
        Math.round(position[2])
      ];
    } else {
      this.lastY = position[2];
    }

    this.light_transform.position = [
      position[0],
      position[1] - 0.3,
      position[2]
    ];

    const rounded_x = Math.round(((CONFIG.board.size)/2) - position[0]);
    const rounded_y = Math.round(((CONFIG.board.size)/2) - position[2]);
    if (this.last_colored !== rounded_x + '-' + rounded_y) {

      this.boundaries = {
        max_x: Math.max(rounded_x, this.boundaries.max_x),
        min_x: Math.min(rounded_x, this.boundaries.min_x),
        max_y: Math.max(rounded_y, this.boundaries.max_y),
        min_y: Math.min(rounded_y, this.boundaries.min_y)
      };

      this.last_colored = rounded_x + '-' + rounded_y;
      this.board.color_square(
        rounded_x,
        rounded_y,
        this.colors
      )
    }

  }
}
