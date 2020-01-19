import { Scene, WebGLRenderer, PerspectiveCamera, AxesHelper } from 'three';
import * as ThreeHelper from './utils/three-helper'; 
import Player from './characters/player';
import Level from './level';
import Store from './store';
import { resolve } from 'dns';

export default class Game{
    time: number;
    scene: Scene;
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    container: HTMLElement;
    player: Player;
    level: Level;
    store: Store;

    constructor(rootNode: HTMLElement) {
        this.time = 0;

        this.store = Store.getInstance();

        // LoadScene, MainMenuScena, GameScene
        this.scene = new Scene();

        this.renderer = ThreeHelper.initRenderer();
        this.camera = ThreeHelper.initCamera();

        this.container = rootNode ? rootNode : document.querySelector('body');
        rootNode.appendChild(this.renderer.domElement);
        

        // add player
        this.player = new Player();
        
        // add level
        this.level = new Level();
        this.level.lightList.forEach((item) => { this.scene.add(item); });
        this.level.meshList.forEach((item) => { this.scene.add(item); });

        ThreeHelper.onResize(this.renderer, this.camera);
        window.addEventListener('resize', () => ThreeHelper.onResize(this.renderer, this.camera));

        this.player.init(this.scene, this.camera).then(() => {  
            this.run();
            this.container.classList.add('is-loaded');
        });
    }


    run(time?: number): void {
        const deltaTime = time - this.time;
        this.time = time;

        this.player.update( deltaTime );
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }

}
