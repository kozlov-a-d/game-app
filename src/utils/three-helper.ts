import { WebGLRenderer, PerspectiveCamera, AmbientLight, TextureLoader, RepeatWrapping, PlaneGeometry, MeshLambertMaterial, DoubleSide, Mesh, BoxGeometry, Color } from 'three';

// COMMON

export function initRenderer() {
    let renderer = new WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    return renderer;
}

export function initCamera() {
    let camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 0, 25 );
    camera.lookAt( 0, 0, 0 );
    return camera;
}

export function onResize(renderer: WebGLRenderer, camera: PerspectiveCamera){
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
const materialPlane = new MeshLambertMaterial( {color: 0x374a5b, side: DoubleSide} );

export function createPlane(coordCenter:{x: number, y: number, z:number}): Mesh {
    let plane =  new Mesh( geometryPlane, materialPlane );
    plane.position.x = coordCenter.x;
    plane.position.y = coordCenter.y;
    plane.position.z = coordCenter.z;
    plane.receiveShadow = true;
    plane.name = "plane";

    return plane; 
}

const geometryBox = new BoxGeometry( 1, 1, 4);
const materialBox = new MeshLambertMaterial( { color: 0x312c30 } );

export function createBox(position: {x: number, y: number, z: number}): Mesh {
    let box = new Mesh( geometryBox, materialBox )
    box.position.x = position.x;
    box.position.y = position.y;
    box.position.z = position.z;
    box.castShadow = true;
    box.receiveShadow = true;
    box.name = "box";
    return box;
}