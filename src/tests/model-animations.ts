import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, AxesHelper, AnimationMixer, Group, DirectionalLight } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Utils from '../utils/';
import Player from "../characters/player";

export default class TestModelAnimations {
    time: number;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    container: HTMLElement;
    player: Player;
    level: Mesh;
    loader: FBXLoader;
    mixer: AnimationMixer;
    mesh1: Mesh | Group;
    mesh2: Mesh | Group;
    
    constructor(rootNode: HTMLElement) {
        this.time = 0;
        this.scene = new Scene();

        this.renderer = Utils.three.initRenderer();

        this.camera = Utils.three.initCamera();
        this.camera.position.set( 0, -5, 2 );
        this.camera.lookAt( 0, 0, 0 );

        this.level = this.initLevel();
        this.initGlobalLight();

        this.container = rootNode ? rootNode : document.querySelector('body');
        rootNode.appendChild(this.renderer.domElement);

        this.mixer;
        this.mesh1;
        this.loader = new FBXLoader();

        this.loader.load('build/assets/models/character.fbx', ( object ) => {
            const clone = Utils.three.cloneSkinnedMeshes(object);
            console.log(object);
            // this.mixer = new AnimationMixer(clone);
            
            clone.traverse( function ( child: any ) {
                child.castShadow = true;
                child.receiveShadow = true;
            } );

            const scaleModify = 0.013;
            clone.scale.x = scaleModify;
            clone.scale.y = scaleModify;
            clone.scale.z = scaleModify;

            clone.position.x = 2;
            clone.position.y = 0;

            clone.rotation.x = 270 * Math.PI/180;
            clone.rotation.y = 180 * Math.PI/180;
            clone.rotation.z = 180 * Math.PI/180;

            this.mesh1 = clone;
            this.mesh1.name = 'Player1';
            this.scene.add(this.mesh1);


            const clone2 = Utils.three.cloneSkinnedMeshes(object);
            console.log(object);
            // this.mixer = new AnimationMixer(clone);
            
            clone2.traverse( function ( child: any ) {
                child.castShadow = true;
                child.receiveShadow = true;
            } );

            clone2.scale.x = scaleModify;
            clone2.scale.y = scaleModify;
            clone2.scale.z = scaleModify;

            clone2.position.x = -2;
            clone2.position.y = 0;

            clone2.rotation.x = 270 * Math.PI/180;
            clone2.rotation.y = 180 * Math.PI/180;
            clone2.rotation.z = 180 * Math.PI/180;

            this.mesh2 = clone2;
            this.mesh2.name = 'Player2';
            this.scene.add(this.mesh2);

            console.log('loadMesh'); 
            
        });

        this.run();
        this.container.classList.add('is-loaded');
    }

    initLevel(): Mesh {
        const axesHelper = new AxesHelper( 5 );
        this.scene.add( axesHelper );

        const geometry = new PlaneGeometry( 20, 20, 1 );
        const material = new MeshBasicMaterial( {color: 0xcccccc, side: DoubleSide} );
        const plane = new Mesh( geometry, material );
        this.scene.add( plane );

        return plane;
    }

    initGlobalLight(): void {
        const dirLight = new DirectionalLight( 0xffffff );
        dirLight.position.set( - 3, -10, 10 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add( dirLight );
    }

    update(deltaTime: number): void {
        deltaTime = deltaTime + 0;
    }

    run(time?: number): void {
        const deltaTime = time - this.time;
        this.time = time;
        this.update( deltaTime );
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }
}