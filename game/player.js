import * as THREE from 'three';
import Utils from './utils.js';
import Controls from './controls.js';
import Bullets from './bullets.js';
import PistolWeapon from './weapons/pistol-weapon';

export default class Player {
    constructor(scene, bullets, audioManager) {
        this.config = {
            moveSpeed: 10,
            rotationSpeed: 1,
        }
        this.score = 0;
        this.controls = new Controls();

        this.mesh = this.createMesh();
        scene.add(this.mesh);

        this.light = this.createLight();
        scene.add(this.light);

        this.weaponsList = [];
        this.weaponsList.push( new PistolWeapon(this) );
        this.currentWeapons = null;
        this.changeWeapons(0);

        this.ammo = {
            '9mm': 4
        };

        this.controls.onFireClick = (event) => {
            this.shoot(scene, bullets, audioManager);
            if (this.score > 0) {
                this.score -= 100;
            } 
        }
        this.controls.onKeyPress = (states) => {
           if(states.reload) {
            this.currentWeapons.reload(audioManager);
           }
        }
    }

    /**
     * @return {THREE.Mesh} player mesh
     */
    createMesh() {
        let player;
        const playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const playerMaterial = new THREE.MeshLambertMaterial( { color: 0x34495e } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );
        player.position.z = 0.501;
        player.position.x = 18;
        player.position.y = 18;
        player.name = 'Player';
        
        return player;
    }

    /**
     * @return {THREE.PointLight} light
     */
    createLight() {
        const light = new THREE.PointLight( 0xffffff, 5, 200 );
        light.position.set( 0, 0, 3 );
        light.castShadow = true;
        light.name = 'PlayerLight';
        return light;
    }

    changeWeapons(index){
        if (this.weaponsList[index]) {
            if (this.currentWeapons) {
                this.mesh.remove(this.currentWeapons.mesh);
            }
            this.currentWeapons = this.weaponsList[index];
            this.mesh.add(this.currentWeapons.mesh);
        } else {
            console.error(`нет оружия с индексом ${this.weaponsList[index]}`);
        }
        
    }

    move(deltaTime) {
        const distance = this.config.moveSpeed * (deltaTime/1000);
        this.mesh.rotation.z = this.controls.direction;
        if (this.controls.states.up) { this.mesh.position.y += distance; }
        if (this.controls.states.down) { this.mesh.position.y -= distance; }
        if (this.controls.states.left) { this.mesh.position.x -= distance; }
        if (this.controls.states.right) { this.mesh.position.x += distance; }
    }

    shoot(scene, bullets, audioManager){
        this.currentWeapons.shoot(scene, bullets, audioManager);
    }

    /**
     * Update player
     * @param {Array.<THREE.Mesh>} meshListToCollision 
     */
    update(deltaTime, meshListToCollision, enemyList) {
        let oldPosition = {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
        }
        this.move(deltaTime);
        if (Utils.detectCollision(this.mesh, meshListToCollision)) {
            this.mesh.position.x = oldPosition.x;
            this.mesh.position.y = oldPosition.y;
        }
        if (Utils.detectCollision(this.mesh, enemyList)) {
            this.mesh.position.x = oldPosition.x;
            this.mesh.position.y = oldPosition.y;
        }
        this.light.position.x = this.mesh.position.x;
        this.light.position.y = this.mesh.position.y;
    }
}
