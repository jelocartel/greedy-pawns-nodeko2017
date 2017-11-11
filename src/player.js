import { CONFIG } from './config';

import { Render, Transform, Move } from 'cervus/components';
import { Box } from 'cervus/shapes';

export class Player {
  constructor() {
    this.lastX = 0;
    this.lastY = 0;
    this.last_colored = '';

    this.entity = new Box();
    this.entity.add_component(new Move({
      keyboard_controlled: true,
      rotate_speed: 0
    }));

    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render),
      move: this.entity.get_component(Move)
    };

    this.components.render.material = CONFIG.material;
    this.components.render.color = 'ff00ff';
    this.components.transform.position = [0, 0, 3];
    CONFIG.game.add(this.entity);
  }

  on_tick() {

  }
}
