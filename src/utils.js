export function color_to_buffer(color) {
  return (255   << 24) |
  (color[2]*255 << 16) |
  (color[1]*255 <<  8) |
  ~~(color[0] * 255);
}

export function lighter_color(color, lum = -0.2) {
  return color.map(cl => {
    return Math.round(Math.min(Math.max(0, cl + (cl * lum)), 255));
  });
}

export function chunk_array(array, min_x, min_y, max_x, max_y) {
  return array.slice(min_y, max_y+1).map(row => row.slice(min_x, max_x+1));
}

const a = [];
const size = 5;
let count = 0;
for (let x = 0; x < size; x++) {
  a[x] = [];
  for (let y = 0; y < size; y++) {
    a[x][y] = count++;
  }
}
