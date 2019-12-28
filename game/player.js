import * as THREE from 'three';
// import { BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import controls from './controls.js';

export default class Player {
    constructor() {
        this.config = {
            moveSpeed: 0.2,
            rotationSpeed: 360,
        }
        this.controls = new controls();
        this.mesh = this.createMesh();
        this.light = this.createLight();
    }

    /**
     * @return {THREE.Mesh} player mesh
     */
    createMesh() {
        let player, gun;
        const playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const playerMaterial = new THREE.MeshLambertMaterial( { color: 0x34495e } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );
        player.position.z = 0.501;
        // player.castShadow = true;
        // player.receiveShadow = true;

        const gunGeometry = new THREE.BoxGeometry( 0.3, 1.1, 0.3 );
        const gunMaterial = new THREE.MeshLambertMaterial( { color: 0x364249 } );
        gun = new THREE.Mesh( gunGeometry, gunMaterial );
        gun.position.y = 0.2;
        player.add( gun );

        return player;
    }

    /**
     * @return {THREE.PointLight} light
     */
    createLight() {
        const light = new THREE.PointLight( 0xffffff, 5, 200 );
        light.position.set( 0, 0, 3 );
        light.castShadow = true;
        return light;
    }

    move() {
        this.mesh.rotation.z = this.controls.direction;
        if (this.controls.up) { this.mesh.position.y += this.config.moveSpeed; }
        if (this.controls.down) { this.mesh.position.y -= this.config.moveSpeed; }
        if (this.controls.left) { this.mesh.position.x -= this.config.moveSpeed; }
        if (this.controls.right) { this.mesh.position.x += this.config.moveSpeed; }
    }

    /**
     * Update player
     * @param {Array.<THREE.Mesh>} meshListToCollision 
     */
    update(meshListToCollision) {
        let oldPosition = {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
        }
        this.move();
        if (this.detectCollision(meshListToCollision)) {
            this.mesh.position.x = oldPosition.x;
            this.mesh.position.y = oldPosition.y;
        }

        this.light.position.x = this.mesh.position.x;
        this.light.position.y = this.mesh.position.y;
    }

    /**
     * Detect collision player  with other mesh
     * @param {Array.<THREE.Mesh>} meshListToCollision 
     */
    detectCollision(meshListToCollision) {
        let isCollision = false;
        this.mesh.geometry.computeBoundingBox(); 
        this.mesh.updateMatrixWorld();
        let box1 = this.mesh.geometry.boundingBox.clone();
        box1.applyMatrix4(this.mesh.matrixWorld);

        meshListToCollision.forEach((item) => {
            item.geometry.computeBoundingBox();
            item.updateMatrixWorld();
        
            let box2 = item.geometry.boundingBox.clone();
            box2.applyMatrix4(item.matrixWorld);

            let result = box1.intersectsBox(box2);
            if (result) isCollision = result;
        });

        return isCollision;
    }
}
