import { World } from './world';
import { Board } from './board';
import { Player } from './player';

const world = new World();
const board = new Board({world});
const player = window.player = new Player({world, board});

world.game.on('tick', (e) => {
  player.on_tick();
  world.light_transform.position = [
    world.camera_transform.position[0],
    world.camera_transform.position[1] - 7,
    world.camera_transform.position[2],
  ];

  // if ((~~(e/200)*100)%1000 === 0) {
  //   player.end_round_calculations();
  // }
});
