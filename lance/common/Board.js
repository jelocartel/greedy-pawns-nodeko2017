'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class Board extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            board: { type: Serializer.TYPES.STRING },
            size: { type: Serializer.TYPES.INT16 },
            stating_field_size: { type: Serializer.TYPES.INT16 }
        }, super.netScheme );
    }

    syncTo(other) {
        super.syncTo(other);
        this.board = other.board;
        this.size = other.size;
        this.stating_field_size = other.stating_field_size;
    }

    constructor(id, size, stating_field_size) {
        super(id);
        this.class = Board;
        this.size = size;
        this.stating_field_size = stating_field_size;
        this.board= (new Array(size)).fill((new Array(size)).fill(0));
        this.board = JSON.stringify(this.board);
    }
    setVal(x, y, val) {
      let tmp = JSON.parse(this.board);
      tmp[y][x] = val;
      this.board = JSON.stringify(tmp);
    }
    getArray() {
      return JSON.parse(this.board);
    }

    mark_user_starting_filed(x, y, user) {
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
}
module.exports = Board;
