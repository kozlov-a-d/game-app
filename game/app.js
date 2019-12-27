import * as THREE from 'three';
// import { Scene, WebGLRenderer, PerspectiveCamera} from 'three';
import Level from './level';
import Player from './player';

export default class Game {
    constructor(rootElement){
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 0, 20 );
        this.camera.lookAt( 0, 0, 0 );

        this.container = rootElement;
        this.container.appendChild(this.renderer.domElement);

        this.meshList = {}

        this.player = new Player();
        this.scene.add(this.player.mesh);

        this.level = new Level(this.player);
        this.level.meshList.forEach((item) => {
            this.scene.add(item);
        });

        this.lightPlayer = new THREE.PointLight( 0xffffff, 10, 200, 2);
        this.lightPlayer.position.set( 0, 0, 3 );
        this.lightPlayer.castShadow = true;
        this.scene.add(this.lightPlayer);

        this.resize();
        window.addEventListener('resize', this.resize.bind(this)); 

        this.run();
        console.log(this);
    }

    resize(){
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.renderer.setSize( w, h );
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    updatePlayer() {
        if (!this.detectCollisionPlayer()) {
            this.player.move();

            this.lightPlayer.position.x = this.player.mesh.position.x;
            this.lightPlayer.position.y = this.player.mesh.position.y;
            this.camera.position.set( this.player.mesh.position.x, this.player.mesh.position.y, 20 );
            this.camera.lookAt( this.player.mesh.position.x, this.player.mesh.position.y, 0 );
        } else {
            console.log('коллизия');
        }
    }

    detectCollisionPlayer() {
        let isCollision = false;
        this.player.mesh.geometry.computeBoundingBox(); //not needed if its already calculated
        this.player.mesh.updateMatrixWorld();

        this.level.meshList.forEach((item) => {
            if (item.type !== 'AmbientLight') {
                item.geometry.computeBoundingBox();
                item.updateMatrixWorld();

                let box1 = this.player.mesh.geometry.boundingBox.clone();
                box1.applyMatrix4(this.player.mesh.matrixWorld);
            
                let box2 = item.geometry.boundingBox.clone();
                box2.applyMatrix4(item.matrixWorld);

                // console.log(item.name, box1.intersectsBox(box2));
                // console.log(this.player.mesh.position.x, item.position.x);
                // console.log(this.player.mesh.position.y, item.position.y);

                let result = box1.intersectsBox(box2);
                if (result) isCollision = result;
            }
        });

        return isCollision;
    }

    run(time) {
        requestAnimationFrame((time) => this.run(time));

        this.updatePlayer();

        this.renderer.render( this.scene, this.camera );
    }
}

const game = new Game(document.getElementById('game'));
// game.run();