import * as THREE from 'three';
// import { Scene, WebGLRenderer, PerspectiveCamera} from 'three';
import Level from './level';
import Player from './player';
import Enemy from './enemy.js';

export default class Game {
    constructor(rootElement){
        this.time = 0;
        
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 0, 25 );
        this.camera.lookAt( 0, 0, 0 );

        this.container = rootElement;
        this.container.appendChild(this.renderer.domElement);

        this.enemyList = [];
        this.bullets = [];
        
        // add player
        this.player = new Player(this.scene, this.bullets);

        // add level
        this.level = new Level(this.player);
        this.level.lightList.forEach((item) => { this.scene.add(item); });
        this.level.meshList.forEach((item) => { this.scene.add(item); });

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
       
        let enemy= new Enemy(-150, -150);
        this.enemyList.push(enemy.mesh);
        this.scene.add(enemy.mesh);

        this.scoreContainer = document.getElementById('score');

        this.run();
    }

    resize(){
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.renderer.setSize( w, h );
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    cameraFollowPlayer() {
        // this.camera.position.set( this.player.mesh.position.x - 5*Math.sin(this.player.mesh.rotation.z), this.player.mesh.position.y + 5*Math.sin(this.player.mesh.rotation.z), 25 );
        // this.camera.lookAt( this.player.mesh.position.x - 5*Math.sin(this.player.mesh.rotation.z), this.player.mesh.position.y + 5*Math.sin(this.player.mesh.rotation.z), 0 );
        this.camera.position.set( this.player.mesh.position.x, this.player.mesh.position.y, 25 );
        this.camera.lookAt( this.player.mesh.position.x, this.player.mesh.position.y, 0 );
    }

    run(time) {
        const deltaTime = time - this.time;
        this.time = time;
        this.player.update(this.level.meshList);
        this.cameraFollowPlayer();
        if(Math.random() <= 0.01) {
            let enemy= new Enemy(Math.random()*50, Math.random()*50);
            this.enemyList.push(enemy.mesh);
            this.scene.add(enemy.mesh);
        }
        this.bullets.forEach((bullet, index) => {
            let bulletUpdate = bullet.update(deltaTime, this.level.meshList, this.enemyList);
            if (!bulletUpdate) {
                this.scene.remove(this.bullets[index].mesh);
                this.bullets.splice(index, 1);
            };
            if (bulletUpdate.toString().substring(0,3) == 'hit') {
                console.log('hit');
                // console.log(bulletUpdate.toString().substring(3));
                this.scene.remove(this.bullets[index].mesh);
                this.bullets.splice(index, 1);
                this.scene.remove(this.enemyList[bulletUpdate.toString().substring(3)*1]);
                this.enemyList.splice(bulletUpdate.toString().substring(3)*1, 1);
                this.player.score += 500;
            }
        });

        if (this.player.score > 0) {
            this.player.score--;
        } 
        this.scoreContainer.innerText = 'score: ' + this.player.score;
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }
}

const game = new Game(document.getElementById('game'));