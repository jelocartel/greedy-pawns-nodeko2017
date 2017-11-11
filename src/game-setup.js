import { CONFIG } from './config';

import { Game } from 'cervus/core';
import { PhongMaterial } from 'cervus/materials';
import { Render, Transform, Move } from 'cervus/components';

export function GameSetup() {
  const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  CONFIG.game = game;

  const camera_transform = game.camera.get_component(Transform);
  camera_transform.position = [0.074, 10.629, -8.845]
  camera_transform.rotation = [0.387, 0, 0, 0.921];
  window.camera = camera_transform;
  game.camera.get_component(Move).keyboard_controlled = CONFIG.camera.keyboard;
  game.camera.get_component(Move).mouse_controlled = CONFIG.camera.mouse;

  const material = new PhongMaterial({
    requires: [ Render, Transform ]
  });
  CONFIG.material = material;

  return game;
}
