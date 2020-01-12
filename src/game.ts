import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import * as ThreeHelper from './utitls/three.helper';

export default class Game{
    time: number;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    container: HTMLElement;

    constructor(rootNode: HTMLElement) {
        this.time = 0;

        this.scene = new Scene();

        this.renderer = ThreeHelper.initRenderer();
        this.camera = ThreeHelper.initCamera();

        this.container = rootNode ? rootNode : document.querySelector('body');
        rootNode.appendChild(this.renderer.domElement);

        // add player

        // // add level

        ThreeHelper.onResize(this.renderer, this.camera);
        window.addEventListener('resize', ThreeHelper.onResize.bind(this));

        this.run(this.time);
    }


    run(time: number): void {
        const deltaTime = time - this.time;
        this.time = time;

        // console.log(deltaTime); 

        requestAnimationFrame((time) => this.run(time));
    }

}
