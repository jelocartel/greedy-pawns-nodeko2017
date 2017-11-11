export class Algorithm {
  floodFill(scene, x, y, toChange, newValue) {
    if (!scene[x] || !scene[x][y] || scene[x][y] !== toChange) {
      return;
    }
    scene[x][y] = newValue;
    this.floodFill(scene, x+1, y, toChange, newValue);
    this.floodFill(scene, x-1, y, toChange, newValue);
    this.floodFill(scene, x, y+1, toChange, newValue);
    this.floodFill(scene, x, y-1, toChange, newValue);
  }

  fillMyCells(scene) {
    // this temparray should be just part of the scene,
    // calculated from the
    const tempArray = JSON.parse(JSON.stringify(scene));
    tempArray.forEach(row => {
      row.push(1);
      row.unshift(1);
    });

    tempArray.push(new Array(scene.length + 2).fill(1));
    tempArray.unshift(new Array(scene[0].length + 2).fill(1));

    this.floodFill(tempArray, 0, 0, 1, 2);

    tempArray.pop();
    tempArray.shift();
    tempArray.forEach(row => {
      row.shift();
      row.pop();
    });

    return tempArray.map(arr => {
      return arr.map(el => {
        return el === 1 ? 0 : el === 2 ? 1 : el;
      })
    });
  }
}
