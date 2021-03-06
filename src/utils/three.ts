import { WebGLRenderer, PerspectiveCamera, AmbientLight, PlaneGeometry, MeshLambertMaterial, DoubleSide, Mesh, BoxGeometry, Color, Group, Bone } from 'three';
import { AnimationAction } from 'three/src/animation/AnimationAction';

// COMMON

export function initRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
}

export function initCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 0, 25 );
    camera.lookAt( 0, 0, 0 );
    return camera;
}

export function onResize(renderer: WebGLRenderer, camera: PerspectiveCamera): void{
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize( w, h );
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

// BASE OBJECTS

export function createLightGlobal(color?: string | number | Color, intensity?: number): AmbientLight {
    const light = new AmbientLight( color, intensity );
    light.name = "global light";
    return light;
}

const geometryPlane = new PlaneGeometry( 100, 100, 32 );
const materialPlane = new MeshLambertMaterial( {color: 0x666771, side: DoubleSide} );

export function createPlane(coordCenter: { x: number; y: number; z: number}): Mesh {
    const plane =  new Mesh( geometryPlane, materialPlane );
    plane.position.x = coordCenter.x;
    plane.position.y = coordCenter.y;
    plane.position.z = coordCenter.z;
    plane.receiveShadow = true;
    plane.name = "plane";

    return plane; 
}

const geometryBox = new BoxGeometry( 1, 1, 4);
const materialBox = new MeshLambertMaterial( { color: 0x312c30 } );

export function createBox(position: {x: number; y: number; z: number}): Mesh {
    const box = new Mesh( geometryBox, materialBox )
    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = "box";
    return box;
}

function parallelTraverse( a: any, b: any, callback: (...args: any[]) => void ): void {
    callback( a, b );
    for ( let i = 0; i < a.children.length; i ++ ) {
        parallelTraverse( a.children[ i ], b.children[ i ], callback );
    }
}

export function cloneSkinnedMeshes( source: Group ): Group {
    const sourceLookup = new Map();
    const cloneLookup = new Map();

    const clone = source.clone();

    parallelTraverse( source, clone, function ( sourceNode: any, clonedNode: any ) {
        sourceLookup.set( clonedNode, sourceNode );
        cloneLookup.set( sourceNode, clonedNode );
    } );

    clone.traverse( function ( node: any ) {
        if ( ! node.isSkinnedMesh ) return;

        const clonedMesh = node;
        const sourceMesh = sourceLookup.get( node );
        const sourceBones = sourceMesh.skeleton.bones;

        clonedMesh.skeleton = sourceMesh.skeleton.clone();
        clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );

        clonedMesh.skeleton.bones = sourceBones.map( function ( bone: Bone ) {
            return cloneLookup.get( bone );
        } );

        clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );
    } );

    return clone;
}

export function animationSetWeight( action: AnimationAction, weight: number ): void {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
}

export function animationsCrossFade( startAction: AnimationAction, endAction: AnimationAction, duration: number ): void {
    let timerId: NodeJS.Timeout = null;
    let step = 0;
    const totalSteps = 10;

    step = 0;
    clearInterval(timerId);
    timerId = setInterval(() => {
        step++;
        animationSetWeight(startAction, 1 - step/totalSteps);
        animationSetWeight(endAction, step/totalSteps);
        if (step >= totalSteps) {
            clearInterval(timerId);
        }
    }, duration * 1000 / totalSteps);
}
