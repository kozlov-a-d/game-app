import * as THREE from 'three';
import Utils from './utils.js';
import Controls from './controls.js';
import Bullets from './bullets.js';

export default class Player {
    constructor(scene, bullets) {
        this.config = {
            moveSpeed: 0.2,
            rotationSpeed: 1,
        }
        this.score = 0;
        this.controls = new Controls();

        this.mesh = this.createMesh();
        this.mesh.name = 'Player';

        this.light = this.createLight();
        this.light.name = 'PlayerLight';

        scene.add(this.mesh);
        scene.add(this.light);

        document.addEventListener('click', (event) => {
            event.preventDefault();
            this.shoot(scene, bullets);
            if (this.score > 0) {
                this.score -= 100;
            } 
            return false;
        })
    }

    /**
     * @return {THREE.Mesh} player mesh
     */
    createMesh() {
        let player, gun;
        const playerGeometry = new THREE.BoxGeometry( 1, 1, 1 );
        const playerMaterial = new THREE.MeshLambertMaterial( { color: 0x34495e } );
        player = new THREE.Mesh( playerGeometry, playerMaterial );
        player.position.z = 0.501;
        player.position.x = 18;
        player.position.y = 18;

        const gunGeometry = new THREE.BoxGeometry( 0.3, 1.1, 0.3 );
        const gunMaterial = new THREE.MeshLambertMaterial( { color: 0x364249 } );
        gun = new THREE.Mesh( gunGeometry, gunMaterial );
        gun.position.y = 0.2;
        player.add( gun );

        return player;
    }

    /**
     * @return {THREE.PointLight} light
     */
    createLight() {
        const light = new THREE.PointLight( 0xffffff, 5, 200 );
        light.position.set( 0, 0, 3 );
        light.castShadow = true;
        return light;
    }

    move() {
        this.mesh.rotation.z = this.controls.direction;
        if (this.controls.up) { this.mesh.position.y += this.config.moveSpeed; }
        if (this.controls.down) { this.mesh.position.y -= this.config.moveSpeed; }
        if (this.controls.left) { this.mesh.position.x -= this.config.moveSpeed; }
        if (this.controls.right) { this.mesh.position.x += this.config.moveSpeed; }
    }

    shoot(scene, bullets){
        let bullet = new Bullets(this.mesh);
        bullet.mesh.name = 'Bullet';
        scene.add(bullet.mesh);
        bullets.push(bullet);
    }

    /**
     * Update player
     * @param {Array.<THREE.Mesh>} meshListToCollision 
     */
    update(meshListToCollision, enemyList) {
        let oldPosition = {
            x: this.mesh.position.x,
            y: this.mesh.position.y,
        }
        this.move();
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
