import * as THREE from 'three';
import Bullets from '../bullets.js';
import AbstractWeapon from './abstract-weapon';

export default class PistolWeapon extends AbstractWeapon{
    constructor(parent){
        super(parent);
        this.id = 'BerettaM9';
        this.title = 'Beretta M9';
        this.type = 'Pistol';
        this.ammoType = '9mm';
        this.magazine = {
            capacity: 15, // 0 - infinity
            amount: 15
        }
        this.damage = 0; // damage per hit
        this.mesh = this.createMesh();
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

    shoot(scene, bullets, audioManager) { 

        if (this.magazine.capacity === 0 || this.magazine.amount > 0) {
            // стреляем если можем
            this.magazine.amount--;
            let bullet = new Bullets(
                this.parent.mesh.position.x, 
                this.parent.mesh.position.y, 
                this.parent.mesh.position.z, 
                this.parent.mesh.rotation.z);
            bullet.mesh.name = 'Bullet';
            scene.add(bullet.mesh);
            bullets.push(bullet);
    
            if ( audioManager.sounds.weapons[this.id].fire.isPlaying ) { 
                audioManager.sounds.weapons[this.id].fire.stop();
            }
            audioManager.sounds.weapons[this.id].fire.play();
        } else {
            this.reload();
        }

        console.log(this.magazine.amount, this.parent.ammo[this.ammoType]);
    }

    reload() {
        const deltaAmmo = this.magazine.capacity - this.magazine.amount;
        if (deltaAmmo === 0) {
            console.log(`magazine is full`);
        } else {
            if (this.magazine.amount === 0 && this.parent.ammo[this.ammoType] === 0) {
                console.log(`no ammo`);
            } else {
                if (deltaAmmo <= this.parent.ammo[this.ammoType]) {
                    this.magazine.amount += deltaAmmo;
                    this.parent.ammo[this.ammoType] -= deltaAmmo;
                } else {
                    this.magazine.amount  += this.parent.ammo[this.ammoType];
                    this.parent.ammo[this.ammoType] = 0;
                }
                console.log(`reload ${deltaAmmo}`);
            }
            
        }
        console.log(this.magazine.amount, this.parent.ammo[this.ammoType]);
    }
}