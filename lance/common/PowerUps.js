'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const DynamicObject = require('lance-gg').serialize.DynamicObject;

class PowerUps extends DynamicObject {
    constructor() {
        super();
        this.powerUps = [
                            'speed-up', // increase player walking speed
                            'unconquerable', // nobody can take players fields
                            'immortality' // player gain field even if on round end is not in safety area
                        ];
    }

    set_powerup_type() {
        var type = this.powerUps[~~(Math.random*this.powerUps.length -1)];
        return type;
    }

    give_player_powerup(player, improvement) {
        switch(improvement) {
            case 'speed-up':
                return player.walkingSpeed = player.walkingSpeed * 1.3;
                break;
            case 'unconquerable':
                return player.fields.unconquerable = true;
                break;
            case 'immortality':
                return player.immortality = true;
                break;
        }
    }

}
module.exports = PowerUps;
