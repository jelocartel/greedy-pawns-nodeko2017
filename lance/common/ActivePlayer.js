'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class ActivePlayer extends DynamicObject {
    static get netScheme() {
        return Object.assign({
            color: { type: Serializer.TYPES.STRING },
            boundaries: { type: Serializer.TYPES.STRING },
            lastX: { type: Serializer.TYPES.FLOAT32 },
            lastY: { type: Serializer.TYPES.FLOAT32 },
            shape: { type: Serializer.TYPES.UINT8 },
            name: { type: Serializer.TYPES.STRING },
        }, super.netScheme );
    }

    syncTo(other) {
        super.syncTo(other);
        this.color = other.color;
        this.lastX = other.lastX;
        this.lastY = other.lastY;
        this.shape = other.shape;
        this.boundaries = other.boundaries;
        this.name = other.name;
    }

    constructor(id, x, y) {
      // console.log('active player', x, y, id);
        super(id);
        this.position.set(x, y);
        this.playerId = id;
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        this.lastX = this.lastY = 0;
        this.shape = 0;// ~~(Math.random()*2);
        this.class = ActivePlayer;
        x = Math.round(50 - x);
        y = Math.round(50 - y);
        this.boundaries = JSON.stringify({
            max_y: y,
            min_y: y,
            max_x: x,
            min_x: x
        });
        // this.name_div = document.querySelector('input.name-input');
        // this.name = this.name_div.value() || 'Guest-' + Math.floor(Math.random()*7).toString(16);
        this.name = 'Guest-' + Math.floor(Math.random()*10000);
    }
    setboundriesXY(x,y) {
        x = Math.round(50 - x);
        y = Math.round(50 - y);
        let pom = this.getBoundaries();
        //console.log('dupa ' + this.boundaries);
        if(!pom) return;
        if (x < pom.min_x) pom.min_x = x;
        if (x > pom.max_x) pom.max_x = x;
        if (y < pom.min_y) pom.min_y = y;
        if (y > pom.max_y) pom.max_y = y;
        this.boundaries = JSON.stringify(pom);
    }

    getBoundaries() {
        return JSON.parse(this.boundaries);
    }

    onAddToWorld(gameEngine) {
      this.gameEngine = gameEngine;
      if (gameEngine.renderer) {
          gameEngine.renderer.addSprite(this, 'activeplayer');
      }
    }

    attachAI(world) {
      this.bot = true;
      this.dir1 = Math.random() > 0.5 ? 1 : -1;
      this.dir2 = this.dir1 * -1;
      this.axis1 = Math.random() > 0.5 ? 'x' : 'y';
      this.axis2 = this.axis1 === 'x' ? 'y' : 'x';
      this.has_two_axes = Math.random() > 0.5;
      this.chane_on_step = (~~((10 + Math.random() * 500)/100)) * 100;
      this.margin = Math.random() * 3;
      this.gameEngine.on('preStep', (e) => {
        // this.position.y -= Math.cos(e);
        // this.position.x -= Math.sin(e);
        if (this.bot && e.step%10 === 0) {

          this.position[this.axis1] += 0.589 * this.dir1;
          if (this.has_two_axes) {
            // console.log(this.axis2, this.dir2, this.axis1, this.dir1);
            this.position[this.axis2] += 0.589 * this.dir2;
          }

          if ((e.step%this.chane_on_step === 0) ||
           (this.position.x > 48 - this.margin &&
             ((this.axis1 === 'x' && this.dir1 === 1) ||
             (this.axis2 === 'x' && this.dir2 === 1)
              )) ||
           (this.position.x < -48 + this.margin &&
             ((this.axis1 === 'x' && this.dir1 === -1) ||
             (this.axis2 === 'x' && this.dir2 === -1)
              )) ||
           (this.position.y > 48 - this.margin &&
             ((this.axis1 === 'y' && this.dir1 === 1) ||
             (this.axis2 === 'y' && this.dir2 === 1)
              )) ||
           (this.position.y < -48 + this.margin &&
             ((this.axis1 === 'y' && this.dir1 === -1) ||
             (this.axis2 === 'y' && this.dir2 === -1)
              ))) {
                this.margin = Math.random() * 3;
                this.dir1 = Math.random() > 0.5 ? 1 : -1;
                this.dir2 = this.dir1 * -1;
                this.axis1 = Math.random() > 0.5 ? 'x' : 'y';
                this.axis2 = this.axis1 === 'x' ? 'y' : 'x';
                this.has_two_axes = Math.random() > 0.5;
                this.chane_on_step = (~~((10 + Math.random() * 500)/100)) * 100;
          }
          // this.position.y -= 0.1 - Math.random() * 0.2;

          world.objects[1].setVal(this.position.x, this.position.y, this.playerId);
          this.setboundriesXY(this.position.x, this.position.y);
        }
      });
    }
}
module.exports = ActivePlayer;
