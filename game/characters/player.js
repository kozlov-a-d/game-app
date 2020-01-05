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
        this.mesh.rotation.y = this.controls.direction;
        if (this.controls.states.up) { this.collaider.position.y += distance; }
        if (this.controls.states.down) { this.collaider.position.y -= distance; }
        if (this.controls.states.left) { this.collaider.position.x -= distance; }
        if (this.controls.states.right) { this.collaider.position.x += distance; }

        if ( this.controls.states.up || this.controls.states.down || this.controls.states.left || this.controls.states.right) {
            if (!this.states.movement.run) {
                console.log('movement.run');
                this.activateState('movement', 'run');
                this.activateState('direction', 'forwards');
            }
        } else {
            if (!this.states.movement.stay) {
                console.log('movement.stay');
                this.activateState('movement', 'stay');
            }
        }
    }
}