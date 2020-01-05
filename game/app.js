import * as THREE from 'three';
// import LoaderAssets from './loader-assets';
import Assets from './loader-assets';
import Level from './level';
import Player from './characters/player';
import Enemy from './enemy';
import AudioManager from './audio-manager';
import UI from './ui';

export default class Game {
    constructor(rootElement){
        // new LoaderAssets((resources) => {
        Assets.onLoad((resources) => {
            console.log('App.js resources', resources);
            this.time = 0;
            
            this.scene = new THREE.Scene();
            this.renderer = this.initRenderer();
            this.camera = this.initCamera();

            this.audioManager = new AudioManager(this.camera);
            

            this.container = rootElement ? rootElement : document.querySelector('body');
            this.container.appendChild(this.renderer.domElement);

            this.arrayEnemy = [];
            this.arrayBullets = [];
            
            // add player
            // this.player = new Player(this.scene, this.arrayBullets, this.audioManager);
            this.player = new Player('Player');
            this.player.setPosition(18, 18, 1.201);
            this.player.appendToScene(this.scene);

            // mesh.position.z = 0.501;
            // mesh.position.x = 18;
            // mesh.position.y = 18;

            // add level
            this.level = new Level(this.player);
            this.level.lightList.forEach((item) => { this.scene.add(item); });
            this.level.meshList.forEach((item) => { this.scene.add(item); });

            this.onResize();
            window.addEventListener('resize', this.onResize.bind(this));

            // this.spawnEnemy(-150, -150);
            this.spawnEnemy(23, 23);
            this.spawnEnemy(26, 26);
            // for (let i = 0; i < 10; i++ ) { this.spawnEnemy(); }
            // console.log(this);

            // this.ui = new UI();

            this.run();
        });
    }

    /**
     * @return {THREE.WebGLRenderer} renderer 
     */
    initRenderer() {
        let renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: 'logzbuf' } );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    /**
     * @return {THREE.PerspectiveCamera} camera 
     */
    initCamera() {
        let camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        // let camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100 );
        camera.position.set( 0, 0, 25 );
        camera.lookAt( 0, 0, 0 );
        return camera;
    }

    onResize(){
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.renderer.setSize( w, h );
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Camera follow target
     * @param {THREE.Mesh} target 
     */
    cameraFollowTarget(target) {
        // this.camera.position.set( target.position.x - 5*Math.sin(target.rotation.z), target.position.y + 5*Math.sin(target.rotation.z), 25 );
        // this.camera.lookAt( target.position.x - 5*Math.sin(target.rotation.z), target.position.y + 5*Math.sin(target.rotation.z), 0 );
        // this.camera.position.set( target.position.x, target.position.y - 5, 25 );
        this.camera.position.set( target.position.x, target.position.y - 8, 12 );
        this.camera.lookAt( target.position.x, target.position.y, 0 );
    }

    spawnEnemy(posX, posY) {
        let x = posX ? posX : 1 + ( Math.random() * this.level.map[0].length - 2);
        let y = posY ? posY : 1 + ( Math.random() * this.level.map.length - 2);
        let enemy= new Enemy(x, y);
        this.arrayEnemy.push(enemy.mesh);
        this.scene.add(enemy.mesh);
    }

    run(time) {
        const deltaTime = time - this.time;
        this.time = time;

        this.player.update(deltaTime);
        this.cameraFollowTarget(this.player.mesh);

        // if(Math.random() <= 0.01) { console.log('spawnEnemy'); this.spawnEnemy(); }

        this.arrayBullets.forEach((bullet, index) => {
            let bulletUpdate = bullet.update(deltaTime, this.level.meshList, this.arrayEnemy);
            if (!bulletUpdate) {
                this.scene.remove(this.arrayBullets[index].mesh);
                this.arrayBullets.splice(index, 1);
            };
            if (bulletUpdate.toString().substring(0,3) == 'hit') {
                console.log('hit');
                this.scene.remove(this.arrayBullets[index].mesh);
                this.arrayBullets.splice(index, 1);
                this.scene.remove(this.arrayEnemy[bulletUpdate.toString().substring(3)*1]);
                this.arrayEnemy.splice(bulletUpdate.toString().substring(3)*1, 1);
                this.player.score += 500;
            }
        });

        // this.ui.update(this);
        this.renderer.render( this.scene, this.camera );
        requestAnimationFrame((time) => this.run(time));
    }
}

console.log('asdad'); 
new Game(document.getElementById('game'));
