'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Board extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            board: { type: Serializer.TYPES.STRING },
            size: { type: Serializer.TYPES.INT16 },
            random: { type: Serializer.TYPES.INT16 },
            stating_field_size: { type: Serializer.TYPES.INT16 }
        }, super.netScheme );
    }

    // get bendingMultiple() { return null; }
    // get bendingVelocityMultiple() { return null; }

    syncTo(other) {
        super.syncTo(other);
        this.board = other.board;
        this.size = other.size;
        this.random = other.random;
        this.stating_field_size = other.stating_field_size;
    }

    constructor(id, size, stating_field_size, board) {
        super(id);
        this.class = Board;
        this.size = size;
        this.stating_field_size = stating_field_size;
        this.board = (new Array(size)).fill((new Array(size)).fill(0));
        this.board = JSON.stringify(this.board);
        this.random = ~~(Math.random() * 100);
    }

    setVal(x, y, val) {
      if (this.board) {
        x = Math.round(50 - x);
        y = Math.round(50 - y);

        let tmp = JSON.parse(this.board);
        if (tmp && tmp[x]) {
          tmp[x][y] = val;
          this.board = JSON.stringify(tmp);
        }
      }
      this.random = ~~(Math.random() * 100);
      // console.log(this.board);
    }
    setuVal(x, y, val) {
      if (this.board) {
        let tmp = JSON.parse(this.board);
        tmp[x][y] = val;
        this.board = JSON.stringify(tmp);
      }
      this.random = ~~(Math.random() * 100);
    }
    getArray() {
      return JSON.parse(this.board);
    }
    logBoard() {
      JSON.parse(this.board).forEach((val) =>{
        console.log(val.join(' '));
      });
    }

    mark_user_starting_filed(x, y, user) {
      // console.log('user-starting', x, y, user);
      let half_size = ~~(this.stating_field_size/2);
     for (let i = x - half_size; i < x + half_size + 1; i++) {
       for (let j = y - half_size; j < y + half_size + 1; j++) {
         this.setVal(i, j, user);
       }
     }
   }

    get_random_empty_field() {
      let x = ~~(Math.random() * this.size);
      let y = ~~(Math.random() * this.size);
      let board = this.getArray();
      while (board[y][x] !== 0) {
        x = ~~(Math.random() * this.size);
        y = ~~(Math.random() * this.size);
      }

      x -= this.size/2;
      y -= this.size/2;
      return {x, y};
    }

    fill(scene, x, y, toChange, newValue) {
      //console.log(arguments);
      toChange = parseInt(toChange);
      newValue = parseInt(newValue);
      if (!scene[x] || typeof scene[x][y] === 'undefined' || parseInt(scene[x][y]) != toChange) {
        return;
      }
      scene[x][y] = newValue;
      // console.log('scene', scene);
      this.fill(scene, x+1, y, toChange, newValue);
      this.fill(scene, x-1, y, toChange, newValue);
      this.fill(scene, x, y+1, toChange, newValue);
      this.fill(scene, x, y-1, toChange, newValue);
    }
  
    compute_scene(userID, { min_x, min_y, max_x, max_y }) {
      let tempArray = this.getArray().slice(min_x, max_x+1).map(row => row.slice(min_y, max_y+1));
      tempArray.forEach(row => {
        row.push(0);
        row.unshift(0);
      });
      
  
      //this.logBoard();
      tempArray.push(new Array(tempArray[0].length ).fill(0));
      tempArray.unshift(new Array(tempArray[0].length).fill(0));
      
      tempArray = tempArray.map(arr => {
        return arr.map(el => {
          return el != userID ? 0 :parseInt(userID);
        })
      });


  
      this.fill(tempArray, 0, 0, 0, parseInt(userID) + 1);
      
  
      tempArray.pop();
      tempArray.shift();
      tempArray.forEach(row => {
        row.shift();
        row.pop();
      });
      tempArray.forEach((val, x)=> {
        val.forEach((id, y) => {
          if (id === parseInt(userID) || id === 0 ) {
            this.setuVal(min_x + x, min_y + y, userID);
          }
        });
      });
    }
}
module.exports = Board;
