import { GameSetup } from './game-setup';
import { Board } from './board';
import { Player } from './player';

const game = GameSetup();
const board = new Board();
const player = new Player();

game.on('tick', () => {
  player.on_tick();
});
