import { Scene, WebGLRenderer, PerspectiveCamera } from 'three';
import * as ThreeHelper from './utils/three.helper';
import Player from './characters/player';
import Level from './level';

export default class Game{
    time: number;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    container: HTMLElement;
    player: Player;
    level: Level;

    constructor(rootNode: HTMLElement) {
        this.time = 0;

        // LoadScene, MainMenuScena, GameScene
        this.scene = new Scene();

        this.renderer = ThreeHelper.initRenderer();
        this.camera = ThreeHelper.initCamera();

        this.container = rootNode ? rootNode : document.querySelector('body');
        rootNode.appendChild(this.renderer.domElement);

        // add player
        this.player = new Player();
        this.player.body.appendToScene(this.scene);
        this.player.useCamera(this.camera);
        // this.player.setPosition(18, 18, 1.201);

        // // add level
        this.level = new Level();
        this.level.lightList.forEach((item) => { this.scene.add(item); });
        this.level.meshList.forEach((item) => { this.scene.add(item); });

        ThreeHelper.onResize(this.renderer, this.camera);
        window.addEventListener('resize', ThreeHelper.onResize.bind(this));

        this.run();
        console.log(this);
    }


    run(time?: number): void {
        const deltaTime = time - this.time;
        this.time = time;

        this.player.update( deltaTime );
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }

}
