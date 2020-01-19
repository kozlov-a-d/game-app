import { Mesh, Scene, BoxGeometry, MeshToonMaterial, AnimationMixer, Vector3, Group } from "three";
import * as MathHelper from '../utils/math-helper';
import Store from '../store';
import AnimationsController from "./animations-controller";

interface IBody {
    init(resources: any): Promise<void>
    appendToScene(scene: Scene): void;
    getMesh(): Group;
    move(position: {x: number, y: number, z: number}, rotation: {x: number, y: number, z: number}): void;
}

export default class Body implements IBody{
    private store: Store;
    public mesh: Group;
    private mixer: AnimationMixer;
    public animations: AnimationsController;

    constructor(model: string, animations: Array<any>) {
        this.store = Store.getInstance();
        this.mixer = null;
        this.mesh = null;
        this.animations = null;
    }

    public init(resources: { model: string, animations: Array<{ [key: string]: string; }>, audio: string }):Promise<void> {
        return new Promise((resolve) => {

            this.loadMesh(resources.model).then((data) => {
                this.mixer = data.mixer;
                this.mesh = data.object;
                this.mesh.name = 'Player';
                console.log('loadMesh'); 

                this.animations = new AnimationsController(this.mixer);
                this.loadAnimations(resources.animations).then(() => {
                    console.log('loadAnimations', this.animations); 
                    resolve();
                });
            });
        });
    }

    private loadMesh(url: string): Promise<{mixer: AnimationMixer, object: Group}> {
        return new Promise((resolve) => {
            this.store.getResource(url, 'model').then((data) => {
                let object = data.content;
                let mixer = new AnimationMixer(object);
                
                object.traverse( function ( child ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                } );
    
                let scaleModify = 0.013;
                object.scale.x = scaleModify;
                object.scale.y = scaleModify;
                object.scale.z = scaleModify;
    
                let result = {
                    mixer: mixer,
                    object: object
                }
                resolve(result);
            }); 
        });
    }

    private loadAnimations(animations: { [key: string]: string; }[]): any {
        return this.animations.init(animations);
    }

    public updateMixer(deltaTime:number): void {
        if ( this.mixer && deltaTime > 0 ) {
            this.mixer.update( deltaTime/1000 );
        };
    }

    public getMesh(): Group {
        return this.mesh
    }

    public move(position: {x: number, y: number, z: number}, rotation: {x: number, y: number, z: number}): void {
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
