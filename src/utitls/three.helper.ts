import { WebGLRenderer, PerspectiveCamera } from 'three';

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