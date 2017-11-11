import { World } from './world';
import { Board } from './board';
import { Player } from './player';
import { Algorithm } from './algorithm';

const world = new World();
const board = new Board({world});
const player = new Player({world, board});
window.algorithm = new Algorithm();

world.game.on('tick', () => {
  player.on_tick();
  world.light_transform.position = [
    world.camera_transform.position[0],
    world.camera_transform.position[1] - 7,
    world.camera_transform.position[2],
  ];
});
