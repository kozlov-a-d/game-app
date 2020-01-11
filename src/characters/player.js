import * as THREE from 'three';
import Character from './character';
import Controls from './controls.js';

export default class Player extends Character {
    constructor(name) {
        // super(name, 'player');
        super(name);

        this.config = {
            moveSpeed: 10,
            rotationSpeed: 1,
        }
        this.controls = new Controls();
        // console.log(this);
    }


    move(deltaTime) {
        const distance = this.config.moveSpeed * deltaTime;
        const currentPosition = {
            x: this.collaider.position.x,
            y: this.collaider.position.y,
        };

        this.mesh.rotation.y = Math.PI * 2 - this.controls.direction;
        if (this.controls.states.up) { this.collaider.position.y += distance; }
        if (this.controls.states.down) { this.collaider.position.y -= distance; }
        if (this.controls.states.left) { this.collaider.position.x -= distance; }
        if (this.controls.states.right) { this.collaider.position.x += distance; }

        const newPosition = {
            x: this.collaider.position.x - currentPosition.x,
            y: this.collaider.position.y - currentPosition.y,
        };

        if ( this.controls.states.up || this.controls.states.down || this.controls.states.left || this.controls.states.right) {
            if (!this.states.movement.run) {
                // console.log('movement.run');
                this.activateState('movement', 'run');
                this.activateState('direction', 'forwards');
                
            }
            if (this.states.movement.run) {
                const meshDirection =  this.mesh.rotation.y / (Math.PI / 180);
                const moveDirection = (Math.atan2(-1*newPosition.x, -1*newPosition.y) + Math.PI) / (Math.PI / 180);
                let direction = this.calcDirectionByAngleDifference(meshDirection, moveDirection);

                if (!this.states.direction[direction]){
                    this.activateState('direction', direction);
                }
                
                // console.log('== ' + meshDirection, moveDirection + ' ==');
            }
        } else {
            if (!this.states.movement.stay) {
                // console.log('movement.stay');
                this.activateState('movement', 'stay');
            }
        }
    }


    calcDirectionByAngleDifference(meshDirection, moveDirection) {
        let direction = 'forwards';

        let deltaDirection = Math.abs(meshDirection - moveDirection);

        if (22.5 <= deltaDirection && deltaDirection <= 67.5) { direction = 'forwards-right'; }
        if (67.5 <= deltaDirection && deltaDirection <= 112.5) { direction = 'right'; }
        if (112.5 <= deltaDirection && deltaDirection <= 157.5) { direction = 'backwards-right'; }
        if (157.5 <= deltaDirection && deltaDirection <= 202.5) { direction = 'backwards'; }
        if (202.5 <= deltaDirection && deltaDirection <= 247.5) { direction = 'backwards-left'; }
        if (247.5 <= deltaDirection && deltaDirection <= 292.5) { direction = 'left'; }
        if (292.5 <= deltaDirection && deltaDirection <= 337.5) { direction = 'forwards-left'; }

        return direction;
    }
}