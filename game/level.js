import * as THREE from 'three';

export default class Level {
    constructor(){
        this.meshList = [];

        // this.mesh.add(player);
        this.meshList.push(this.createLightGlobal());

        this.meshList.push(this.createPlane());
        this.meshList.push(this.createBox(5, 5));
    }

    createLightGlobal() {
        const light = new THREE.AmbientLight( 0xffffff, 0.2 );
        light.name = "global light";
        return light;
    }

    createPlane() {
        const geometry = new THREE.PlaneGeometry( 100, 100, 32 );
        const material = new THREE.MeshLambertMaterial( {color: 0x34bb34, side: THREE.DoubleSide} );
        let plane =  new THREE.Mesh( geometry, material );
        plane.receiveShadow = true;
        plane.name = "plane";
        return plane;
    }

    createBox(posX = 1, posY = 1, posZ = 0.5, sizeX = 1, sizeY = 1, sizeZ = 4) {
        const geometry = new THREE.BoxGeometry( sizeX, sizeY, sizeZ );
        const material = new THREE.MeshLambertMaterial( { color: 0x381a12 } );
        let box = new THREE.Mesh( geometry, material )
        box.position.x = posX;
        box.position.y = posY;
        box.position.z = posZ;
        box.castShadow = true;
        box.receiveShadow = true;
        box.name = "box";
        return box;
    }
}