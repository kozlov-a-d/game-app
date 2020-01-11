import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Utils from './utils.js';
import Controls from './characters/controls.js';
import Bullets from './bullets.js';
import PistolWeapon from './weapons/pistol-weapon.js';

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
        // scene.add(this.light);

        this.mixer;
        this.animations = {};

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
        
        let self = this;
        // FBXLoader 

        
        const playerGeometry = new THREE.BoxGeometry( 0.01,  0.01,  0.01 );
        // const playerMaterial = new THREE.MeshLambertMaterial( { color: 0x34495e } );
        const playerMaterial = new THREE.MeshToonMaterial( { color: 0x34495e } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );
        player.position.z = 0.501;
        player.position.x = 18;
        player.position.y = 18;
        player.name = 'Player';

        let loader = new FBXLoader();
        loader.load( 'build/assets/models/character.fbx', function ( object ) {
            self.mixer = new THREE.AnimationMixer( object );
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            object.scale.x = 0.02;
            object.scale.y = 0.02;
            object.scale.z = 0.02;
            object.rotation.z = 180 * Math.PI/180;
            object.rotation.x = 270 * Math.PI/180;

            console.log(object);

            player.add( object );

            loader.load( 'build/assets/models/character@idle-rifle.fbx', function ( object ) {
                self.animations.idle = self.mixer.clipAction( object.animations[ 0 ] );
                self.animations.idle.play();
            } );
    
            loader.load( 'build/assets/models/character@run-forwards-rifle.fbx', function ( object ) {
                self.animations.runWithRifle = self.mixer.clipAction( object.animations[ 0 ] );
            } );
            console.log(self.mixer);
        } );

        


        const outline_geo = new THREE.BoxGeometry(1, 1, 1);
        //Notice the second parameter of the material
        const outline_mat = new THREE.MeshBasicMaterial({color : 0x00ff00, side: THREE.BackSide});
        const outline = new THREE.Mesh(outline_geo, outline_mat);
        outline.scale.multiplyScalar(1.05);
        player.add(outline);
        
        return player;
    }

    /**
     * @return {THREE.PointLight} light
     */
    createLight() {
        const light = new THREE.PointLight( 0xffffff, 3, 200 );
        // light.position.set( 0, 0, 3 );
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

        if ( this.controls.states.up || this.controls.states.down || this.controls.states.left || this.controls.states.right) {
            if (this.animations.idle != undefined && this.animations.runWithRifle != undefined) { 
                this.animations.idle.stop();
                this.animations.runWithRifle.play();
            }

        } else {
            
            if (this.animations.idle != undefined && this.animations.runWithRifle != undefined) {
                this.animations.runWithRifle.stop();
                this.animations.idle.play(); 
            }
        }
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
        this.currentWeapons.update(deltaTime);
        if ( this.mixer ) this.mixer.update( deltaTime/1000 );
    }
}
