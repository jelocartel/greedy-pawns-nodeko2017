import { CONFIG } from './config';

import { Game } from 'cervus/core';
import { Box } from 'cervus/shapes';
import { PhongMaterial } from 'cervus/materials';
import { Render, Transform, Move } from 'cervus/components';

import { Board } from './board';

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


const box = new Box();
box.get_component(Transform).position = [ 0, 0, 3 ];
window.box_transform = box.get_component(Transform);
box.get_component(Render).material = material;
box.get_component(Render).color = '0F0';
game.add(box);

new Board();
