import { hex_to_rgb } from 'cervus/utils';

export const CONFIG = {
  camera: {
    keyboard: true,
    mouse: false //true
  },
  debug: true,

  board: {
    position: [0.5, -0.5, 0.5],
    scale: 0.5,
    colors: [
      hex_to_rgb('#FFFFFF'),
      hex_to_rgb('#CCCCCC')
    ],
    size: 100,
    unit_size: 50
  }
};
