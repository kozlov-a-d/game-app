import * as THREE from 'three';

export default class Bullets {
    /**
     * 
     * @param {THREE.Mesh} parent player.mesh or guns.mesh
     */
    constructor(parent) {
        this.position = parent.position;
        this.direction = parent.rotation.z;
        this.speed = 0.8;
        this.mesh = this.createMesh();
        this.mesh.name = 'Bullet';
        this.lifetime = 1500;
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

    update(deltaTime, meshListToCollision, enemyList){
        this.lifetime -= deltaTime;
        if (this.detectCollision(enemyList)) {
            return 'hit' + this.detectCollision(enemyList);
        }
        if (this.detectCollision(meshListToCollision)) {
            return false;
        }
        if (this.lifetime > 0) {
            this.mesh.position.y += this.speed * Math.cos(this.direction);
            this.mesh.position.x += this.speed * Math.sin(this.direction) * -1;  
            // console.log(this.lifetime);
            return true;
        } 
        return false;
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

        meshListToCollision.forEach((item, index) => {
            item.geometry.computeBoundingBox();
            item.updateMatrixWorld();
        
            let box2 = item.geometry.boundingBox.clone();
            box2.applyMatrix4(item.matrixWorld);

            let result = box1.intersectsBox(box2);
            // if (result) isCollision = result;
            if (result) isCollision = index;
        });

        return isCollision;
    }
}