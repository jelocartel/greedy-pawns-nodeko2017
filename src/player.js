import { CONFIG } from './config';

import { Render, Transform } from 'cervus/components';
import { Box } from 'cervus/shapes';

export class Player {
  constructor() {

    this.entity = new Box();
    this.components = {
      transform: this.entity.get_component(Transform),
      render: this.entity.get_component(Render)
    };

    this.components.render.material = CONFIG.material;
    this.components.render.color = 'ff00ff';
    this.components.transform.position = [0, 0, 3];
    CONFIG.game.add(this.entity);
  }
}
