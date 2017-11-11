import { CONFIG } from './config';

import { Game } from 'cervus/core';
import { PhongMaterial } from 'cervus/materials';
import { Render, Transform, Move } from 'cervus/components';

export class World {
  constructor() {
    this.game = new Game({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.camera_transform = this.game.camera.get_component(Transform);
    this.camera_transform.position = [0.074, 10.629, -8.845]
    this.camera_transform.rotation = [0.387, 0, 0, 0.921];
    this.game.camera.get_component(Move).keyboard_controlled = CONFIG.camera.keyboard;
    this.game.camera.get_component(Move).mouse_controlled = CONFIG.camera.mouse;

    this.material = new PhongMaterial({
      requires: [ Render, Transform ]
    });
  }
}
