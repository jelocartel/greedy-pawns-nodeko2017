import { World } from './world';
import { Board } from './board';
import { Player } from './player';
import { model_loader } from 'cervus/core';

window.cervus = {
  models: [
    model_loader('models/pawn.json'),
    // model_loader('models/coffee.json'),
  ],
  scales: [
    0.4,
    0.4
  ],
  World,
  Board,
  Player
}
  // const world = new World();
  // const board = new Board({world});
  //
  // const player_spawning_position = board.get_random_empty_field();
  // const player = window.player = new Player({
  //   shape: data,
  //   world,
  //   board,
  //   options: {
  //     position: player_spawning_position,
  //     base_color: '#'+Math.floor(Math.random()*16777215).toString(16)
  //   }
  // });
  //
  // world.game.on('tick', () => {
  //   player.on_tick();
  //   world.light_transform.position = [
  //     world.camera_transform.position[0],
  //     world.camera_transform.position[1] - 7,
  //     world.camera_transform.position[2],
  //   ];
  // });
