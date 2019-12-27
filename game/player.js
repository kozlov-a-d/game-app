import * as THREE from 'three';
// import { BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import Controls from './controls.js';

export default class Player {
    constructor(scene) {
        this.config = {
            moveSpeed: 0.07,
            rotationSpeed: 360,
        }
        this.control = new Controls();
        this.mesh = this.createPlayerMash();
        scene.add( this.mesh );
    }

    createPlayerMash() {
        let player, gun;
        const playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const playerMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );

        const gunGeometry = new THREE.BoxGeometry( 0.3, 1.3, 0.3 );
        const gunMaterial = new THREE.MeshBasicMaterial( { color: 0x00dd00 } );
        gun = new THREE.Mesh( gunGeometry, gunMaterial );
        gun.position.y = 0.3;

        player.add( gun );

        return player;
    }

    move() {
        // this.mesh.rotation.x += 0.01;
        this.mesh.rotation.z = -0.7953988301841436;
        if (this.control.up) { this.mesh.position.y += this.config.moveSpeed; }
        if (this.control.down) { this.mesh.position.y -= this.config.moveSpeed; }
        if (this.control.left) { this.mesh.position.x -= this.config.moveSpeed; }
        if (this.control.right) { this.mesh.position.x += this.config.moveSpeed; }
    }

}