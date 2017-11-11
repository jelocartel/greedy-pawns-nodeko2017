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
