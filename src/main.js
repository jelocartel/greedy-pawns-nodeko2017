import { World } from './world';
import { Board } from './board';
import { Player } from './player';

const world = new World();
const board = new Board({world});
const player = new Player({world});

world.game.on('tick', () => {
  player.on_tick();
});
