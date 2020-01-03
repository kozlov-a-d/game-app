import * as THREE from 'three';
import Utils from './utils.js';

export default class Bullets {
    /**
     * 
     * @param {THREE.Mesh} parent player.mesh or guns.mesh
     */
    constructor(posX = 0, posY = 0, posZ = 0, angleZ = 0) {
        this.speed = 50;
        this.lifetime = 1500;
        this.movement = {
            x: this.speed * Math.cos(angleZ),
            y: this.speed * Math.sin(angleZ) * -1,
        };
        this.mesh = this.createMesh(posX, posY, posZ, angleZ);
        this.mesh.name = 'Bullet';
    }

    createMesh(posX, posY, posZ, angleZ) {
        const geometry = new THREE.SphereGeometry( 0.1, 6, 6 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        let sphere = new THREE.Mesh( geometry, material );
        sphere.position.x = posX;
        sphere.position.y = posY;
        sphere.position.z = posZ;
        sphere.rotation.z = angleZ;

        return sphere
    }

    update(deltaTime, meshListToCollision, enemyList){
        this.lifetime -= deltaTime;
        const collisionWithEnemy = Utils.detectCollision(this.mesh, enemyList);
        if (collisionWithEnemy) {
            return 'hit' + collisionWithEnemy;
        }
        if (Utils.detectCollision(this.mesh,meshListToCollision)) {
            return false;
        }
        if (this.lifetime > 0) {
            this.mesh.position.y += this.movement.x * (deltaTime/1000);
            this.mesh.position.x += this.movement.y * (deltaTime/1000);  
            return true;
        } 
        return false;
    }
}