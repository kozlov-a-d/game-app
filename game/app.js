import * as THREE from 'three';
// import { Scene, WebGLRenderer, PerspectiveCamera} from 'three';
import Player from './player';

export default class Game {
    constructor(rootElement){
        this.scene =  new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 0, 10 );
        this.camera.lookAt( 0, 0, 0 );

        this.container = rootElement;
        this.container.appendChild(this.renderer.domElement);

        this.objects = {}


        this.player = new Player(this.scene);

        this.resize();
        window.addEventListener('resize', this.resize.bind(this)); 

        this.addObjects();

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

    addObjects() {
        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // this.objects.cube = new THREE.Mesh( geometry, material );
        // this.scene.add( this.objects.cube );
    }

    run(time) {
        requestAnimationFrame((time) => this.run(time));

        this.player.move()

        // this.objects.cube.rotation.x += 0.01;
        // this.objects.cube.rotation.y += 0.01;

        this.renderer.render( this.scene, this.camera );
    }
}

const game = new Game(document.getElementById('game'));
// game.run();