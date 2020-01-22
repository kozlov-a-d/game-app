import { Scene, AnimationMixer, Group } from "three";
import Store from '../store';
import AnimationsController from "./animations-controller";

export default interface Body {
    init(model: Group): void;
    appendToScene(scene: Scene): void;
    getMesh(): Group;
    move(position: {x: number; y: number; z: number}, rotation: {x: number; y: number; z: number}): void;
}

export default class Body implements Body{
    private store: Store;
    public mesh: Group;
    private mixer: AnimationMixer;
    public animations: AnimationsController;

    // constructor(model: string, animations: Array<any>) {
    constructor(model: Group) {
        this.store = Store.getInstance();
        this.mixer = null;
        this.mesh = null;
        this.animations = null;

        this.init(model);
    }

    public init(model: Group): void {
        this.mixer = new AnimationMixer(model);
        this.mesh = this.loadMesh(model);
        this.mesh.name = 'Player';
        console.log('loadMesh'); 

        this.animations = new AnimationsController(this.mixer);
        // this.loadAnimations(resources.animations).then(() => {
        //     console.log('loadAnimations', this.animations); 
        // });
    }

    private loadMesh(model: Group): Group {
        model.traverse( function ( child ) {
            child.castShadow = true;
            child.receiveShadow = true;
        } );
        const scaleModify = 0.013;
        model.scale.x = scaleModify;
        model.scale.y = scaleModify;
        model.scale.z = scaleModify;

        return model;
    }

    private loadAnimations(animations: { [key: string]: string }[]): any {
        return this.animations.init(animations);
    }

    public updateMixer(deltaTime: number): void {
        if ( this.mixer && deltaTime > 0 ) {
            this.mixer.update( deltaTime/1000 );
        }
    }

    public getMesh(): Group {
        return this.mesh
    }

    public move(position: {x: number; y: number; z: number }, rotation: {x: number; y: number; z: number }): void {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.rotation.x = rotation.x;
        this.mesh.rotation.y = rotation.y;
        this.mesh.rotation.z = rotation.z;
    }

    public appendToScene(scene: Scene): void {
        scene.add(this.mesh);
    }
}
