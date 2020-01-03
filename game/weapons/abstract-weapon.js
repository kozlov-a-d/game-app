import * as THREE from 'three';

export default class AbstractWeapon {
    constructor(parent){
        this.parent = parent;
        this.title = 'weapon';
        this.type = 'type';
        this.magazineCapacity = 0; // 0 - infinity
        this.damage = 0; // damage per hit
        this.mesh = this.createMesh()
        
        this.sounds = {
            fire: '',
            reload: ''
        }
    }

    /**
     * @return {THREE.Mesh} weapon mesh
     */
    createMesh() {
        let weapon;
        const gunGeometry = new THREE.BoxGeometry( 0.3, 1.1, 0.3 );
        const gunMaterial = new THREE.MeshLambertMaterial( { color: 0x364249 } );
        weapon = new THREE.Mesh( gunGeometry, gunMaterial );
        weapon.position.y = 0.2;

        return weapon;
    }

    attack() {

    }
}