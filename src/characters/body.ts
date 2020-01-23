import { Scene, Group } from "three";

export default interface Body {
    init(model: Group): void;
    appendToScene(scene: Scene): void;
    getMesh(): Group;
    move(position: {x: number; y: number; z: number}, rotation: {x: number; y: number; z: number}): void;
}

export default class Body implements Body{
    public mesh: Group;

    constructor(model: Group) {
        this.init(model);
    }

    public init(model: Group): void {
        this.mesh = this.loadMesh(model);
        this.mesh.name = 'Player';
        console.log('loadMesh'); 
    }

    private loadMesh(model: Group): Group {
        model.traverse( function ( child ) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        const scaleModify = 0.013;
        model.scale.x = scaleModify;
        model.scale.y = scaleModify;
        model.scale.z = scaleModify;

        return model;
    }

    public getMesh(): Group {
        return this.mesh;
    }

    public move(position: {x: number; y: number; z: number }, rotation: {x: number; y: number; z: number }): void {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.rotation.x = rotation.x;
        this.mesh.rotation.y = rotation.y;
        this.mesh.rotation.z = rotation.z;
    }
}
