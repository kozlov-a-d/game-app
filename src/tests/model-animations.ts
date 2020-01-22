import { Scene, WebGLRenderer, PerspectiveCamera, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, AxesHelper, AnimationMixer, Group, DirectionalLight } from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as ThreeHelper from '../utils/three-helper'; 
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

        this.renderer = ThreeHelper.initRenderer();

        this.camera = ThreeHelper.initCamera();
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
            let clone = this.clone(object);
            console.log(object);
            // this.mixer = new AnimationMixer(clone);
            
            clone.traverse( function ( child: any ) {
                child.castShadow = true;
                child.receiveShadow = true;
            } );

            let scaleModify = 0.013;
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


            let clone2 = this.clone(object);
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

        // this.run();
        this.container.classList.add('is-loaded');
    }

    initLevel(): Mesh {
        var axesHelper = new AxesHelper( 5 );
        this.scene.add( axesHelper );

        var geometry = new PlaneGeometry( 20, 20, 1 );
        var material = new MeshBasicMaterial( {color: 0xcccccc, side: DoubleSide} );
        var plane = new Mesh( geometry, material );
        this.scene.add( plane );

        return plane;
    }

    clone( source: any ) {

        function parallelTraverse( a: any, b: any, callback: any ) {

            callback( a, b );
        
            for ( var i = 0; i < a.children.length; i ++ ) {
        
                parallelTraverse( a.children[ i ], b.children[ i ], callback );
        
            }
        
        }

        var sourceLookup = new Map();
		var cloneLookup = new Map();

		var clone = source.clone();

		parallelTraverse( source, clone, function ( sourceNode: any, clonedNode: any ) {

			sourceLookup.set( clonedNode, sourceNode );
			cloneLookup.set( sourceNode, clonedNode );

		} );

		clone.traverse( function ( node: any ) {

			if ( ! node.isSkinnedMesh ) return;

			var clonedMesh = node;
			var sourceMesh = sourceLookup.get( node );
			var sourceBones = sourceMesh.skeleton.bones;

			clonedMesh.skeleton = sourceMesh.skeleton.clone();
			clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );

			clonedMesh.skeleton.bones = sourceBones.map( function ( bone: any ) {

				return cloneLookup.get( bone );

			} );

			clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );

		} );

		return clone;
    }

    initGlobalLight() {
        var dirLight = new DirectionalLight( 0xffffff );
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

    update(deltaTime: number) {

    }

    run(time?: number): void {
        const deltaTime = time - this.time;
        this.time = time;
        this.update( deltaTime );
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }
}