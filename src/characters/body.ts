import { Mesh, Scene, BoxGeometry, MeshToonMaterial, AnimationMixer, Vector3, Group } from "three";
import * as MathHelper from '../utils/math-helper';
import Store from '../store';

interface IBody {
    init(): Promise<void>
    appendToScene(scene: Scene): void;
    getMesh(): Group;
    move(position: {x: number, y: number, z: number}, rotation: {x: number, y: number, z: number}): void;
}

export default class Body implements IBody{
    private store: Store;
    public mesh: Group;
    private mixer: AnimationMixer;
    private animations: Array<any>; 

    constructor(model: string, animations: Array<any>) {
        this.store = Store.getInstance();
        this.mixer = null;
        this.mesh = null;
        // this.animations = null;
    }

    public init():Promise<void> {
        return new Promise((resolve) => {

            this.createMesh().then((data) => {
                this.mixer = data.mixer;
                this.mesh = data.object;
                resolve();
            });
            
        })
    }

    private createMesh(): Promise<{mixer: AnimationMixer, object: Group}> {
        return new Promise((resolve) => {
            this.store.getResource('src/assets/models/character.fbx', 'model').then((data) => {
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
