export class FloodFill {
  fill(scene, x, y, toChange, newValue) {
    if (!scene[x] || !scene[x][y] || scene[x][y] !== toChange) {
      return;
    }
    scene[x][y] = newValue;
    this.fill(scene, x+1, y, toChange, newValue);
    this.fill(scene, x-1, y, toChange, newValue);
    this.fill(scene, x, y+1, toChange, newValue);
    this.fill(scene, x, y-1, toChange, newValue);
  }

  compute_scene(scene, userID) {
    // this temparray should be just part of the scene,
    // calculated from the
    const tempArray = JSON.parse(JSON.stringify(scene));
    tempArray.forEach(row => {
      row.push(0);
      row.unshift(0);
    });

    tempArray.push(new Array(scene.length + 2).fill(0));
    tempArray.unshift(new Array(scene.length + 2).fill(0));

    tempArray = tempArray.map(arr => {
      return arr.map(el => {
        return el !== userID ? 0 : userID;
      })
    });

    this.fill(tempArray, 0, 0, 0, userID + 1);

    tempArray.pop();
    tempArray.shift();
    tempArray.forEach(row => {
      row.shift();
      row.pop();
    });

    return tempArray.map(arr => {
      return arr.map(el => {
        return el === userID + 1 ? 0 : (el === 0 || el === userID) ? 1 : el;
      })
    });
  }
}
