import * as THREE from 'three';
// import { Scene, WebGLRenderer, PerspectiveCamera} from 'three';
import Level from './level';
import Player from './player';

export default class Game {
    constructor(rootElement){
        this.time = 0;
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 0, 20 );
        this.camera.lookAt( 0, 0, 0 );

        this.container = rootElement;
        this.container.appendChild(this.renderer.domElement);

        this.bullets = [];
        
        // add player
        this.player = new Player(this.scene, this.bullets);

        // add level
        this.level = new Level(this.player);
        this.level.lightList.forEach((item) => { this.scene.add(item); });
        this.level.meshList.forEach((item) => { this.scene.add(item); });

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
       
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
        this.camera.position.set( this.player.mesh.position.x, this.player.mesh.position.y, 20 );
        this.camera.lookAt( this.player.mesh.position.x, this.player.mesh.position.y, 0 );
    }

    run(time) {
        const deltaTime = time - this.time;
        this.time = time;
        this.player.update(this.level.meshList);
        this.cameraFollowPlayer();
        this.bullets.forEach((bullet, index) => {
            if (!bullet.update(deltaTime)) {
                this.scene.remove(this.bullets[index]);
                this.bullets.splice(index, 1);
                console.log(this.bullets);
            }
        });
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }
}

const game = new Game(document.getElementById('game'));