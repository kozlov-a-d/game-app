import * as THREE from 'three';

export default class Bullets {
    /**
     * 
     * @param {THREE.Mesh} parent player.mesh or guns.mesh
     */
    constructor(parent) {
        this.position = parent.position;
        this.direction = parent.rotation.z;
        this.speed = 0.5;
        this.mesh = this.createMesh();
        this.lifetime = 200;
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry( 0.1, 6, 6 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        let sphere = new THREE.Mesh( geometry, material );
        sphere.position.x = this.position.x;
        sphere.position.y = this.position.y;
        sphere.position.z = this.position.z;

        return sphere
    }

    update(deltaTime){
        this.lifetime -= deltaTime;
        if (this.lifetime > 0) {
            this.mesh.position.y += this.speed * Math.cos(this.direction);
            this.mesh.position.x += this.speed * Math.sin(this.direction) * -1;  
            // console.log(this.lifetime);
            return true;
        } 
        return false;
    }
}