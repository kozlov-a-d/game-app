import * as THREE from 'three';

export default class Level {
    constructor(){
        this.lightList = [];
        this.meshList = [];

        // this.mesh.add(player);
        this.lightList.push(this.createLightGlobal());

        this.meshList.push(this.createPlane());
        this.meshList.push(this.createBox(5, 3));
        this.meshList.push(this.createBox(5, 4));
        this.meshList.push(this.createBox(5, 5));
        this.meshList.push(this.createBox(5, 6));
        this.meshList.push(this.createBox(4, 6));
        this.meshList.push(this.createBox(3, 6));
        this.meshList.push(this.createBox(2, 6));
    }

    createLightGlobal() {
        const light = new THREE.AmbientLight( 0xffffff, 0.2 );
        light.name = "global light";
        return light;
    }

    createPlane() {
        const geometry = new THREE.PlaneGeometry( 100, 100, 32 );
        const material = new THREE.MeshLambertMaterial( {color: 0x3c3c3c, side: THREE.DoubleSide} );
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