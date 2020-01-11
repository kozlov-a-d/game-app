import * as THREE from 'three';

export default class Emeny {
    constructor(posX, posY) {
        this.config = {
            moveSpeed: 0.2,
            rotationSpeed: 1,
        }
        this.mesh = this.createMesh(posX, posY);
        this.mesh.name = 'Emeny';
    }

    /**
     * @return {THREE.Mesh} emeny mesh
     */
    createMesh(posX, posY) {
        let emeny;
        const emenyGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const emenyMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
        emeny = new THREE.Mesh( emenyGeometry, emenyMaterial );
        emeny.position.z = 0.501;
        emeny.position.x = posX;
        emeny.position.y = posY;
        return emeny;
    }

    move() {
       
    }

    shoot(){
        
    }

    /**
     * Update emeny
     */
    update() {

    }

}
