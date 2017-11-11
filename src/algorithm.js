// condition to launch filling fields
// player position is in player color and ownToUser (form previous rounds = is user safety field)
// if(scene[player.position.x][player.position.y].color ===  myColor && scene[player.position.x][player.position.y].ownToUser) {
//  fillMyCells(scene, myColor)
// }

export class Algorithmes {
  constructor() {
    console.log('elo');
  }

  floodFill(scene, x, y, toChange, newValue) {
    if (!scene[x] || !scene[x][y] || scene[x][y] !== toChange) {
      return;
    }
    scene[x][y] = newValue;
    floodFill(scene, x+1, y, toChange, newValue);
    floodFill(scene, x-1, y, toChange, newValue);
    floodFill(scene, x, y+1, toChange, newValue);
    floodFill(scene, x, y-1, toChange, newValue);
  }

  fillMyCells(scene, myColor) {
    var newArray = new Array(scene.length).fill(null).map(()=>new Array(scene[0].length).fill(null));
    for (var i =  0; i < scene.length; i++) {
      for  (var j = 0; j < scene[0].length; j++) {
        if (scene[i][j].color === myColor) {
          newArray[i][j] = 0;
        } else {
          newArray[i][j] = 1;
        }
      }
    }
    // // all old fields has myCOlor and all fields on road has myColor
    var tempArray = newArray;
    tempArray.forEach(function(row) {
      row.push(1);
    });
    tempArray.forEach(function(row) {
      row.unshift(1);
    });
    tempArray.push(new Array(scene.length + 2).fill(1));
    tempArray.unshift(new Array(scene[0].length + 2).fill(1));
    console.log('tempArray= ', tempArray);
    floodFill(tempArray, 0, 0, 1, 2);
    // make array smaller again
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
          scene[i][j].color = myColor;
        }
      }
    }
  }
}
