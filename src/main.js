import { World } from './world';
import { Board } from './board';
import { Player } from './player';

const world = new World();
const board = new Board({world});
const player = window.player = new Player({world, board});

world.game.on('tick', () => {
  player.on_tick();
  world.light_transform.position = [
    world.camera_transform.position[0],
    world.camera_transform.position[1] - 7,
    world.camera_transform.position[2],
  ];
});
