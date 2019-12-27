import * as THREE from 'three';
// import { BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import Controls from './controls.js';

export default class Player {
    constructor() {
        this.config = {
            moveSpeed: 0.2,
            rotationSpeed: 360,
        }
        this.control = new Controls();
        this.mesh = this.createPlayerMesh();
    }

    createPlayerMesh() {
        let player, gun;
        const playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const playerMaterial = new THREE.MeshLambertMaterial( { color: 0x34495e } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );
        player.position.z = 0.501;
        // player.castShadow = true;
        // player.receiveShadow = true;

        const gunGeometry = new THREE.BoxGeometry( 0.3, 1.3, 0.3 );
        const gunMaterial = new THREE.MeshLambertMaterial( { color: 0x364249 } );
        gun = new THREE.Mesh( gunGeometry, gunMaterial );
        gun.position.y = 0.3;
        player.add( gun );

        // const light = new THREE.PointLight( 0xffffff, 5, 200 );
        // light.position.set( 0, 0, 3 );
        // player.add( light );

        return player;
    }

    move() {
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.z = -0.7953988301841436;
        this.mesh.rotation.z = this.control.direction;
        if (this.control.up) { this.mesh.position.y += this.config.moveSpeed; }
        if (this.control.down) { this.mesh.position.y -= this.config.moveSpeed; }
        if (this.control.left) { this.mesh.position.x -= this.config.moveSpeed; }
        if (this.control.right) { this.mesh.position.x += this.config.moveSpeed; }
    }

}