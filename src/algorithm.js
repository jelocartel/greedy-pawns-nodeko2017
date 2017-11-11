// condition to launch filling fields
// player position is in player color and ownToUser (form previous rounds = is user safety field)
// if(scene[player.position.x][player.position.y].color ===  myColor && scene[player.position.x][player.position.y].ownToUser) {
//  fillMyCells(scene, myColor)
// }

export class Algorithm {
  constructor() {
    console.log('elo');
  }

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
    var tempArray = scene.slice();
    tempArray.forEach(function(row) {
      row.push(1);
    });
    tempArray.forEach(function(row) {
      row.unshift(1);
    });
    tempArray.push(new Array(scene.length + 2).fill(1));
    tempArray.unshift(new Array(scene[0].length + 2).fill(1));
    this.floodFill(tempArray, 0, 0, 1, 2);
    
    tempArray.pop();
    tempArray.shift();
    tempArray.forEach(function(row) {
      row.shift();
    });
    tempArray.forEach(function(row) {
      row.pop();
    });

    for (var i =  0; i < scene.length; i++) {
      for  (var j = 0; j < scene[0].length; j++) {
        if (tempArray[i][j] === 1) {
          scene[i][j] = 0;
        } else if (tempArray[i][j] === 2) {
          scene[i][j] = 1;
        }
      }
    }
    return tempArray;
  }
}
