import { Mesh, Scene, BoxGeometry, MeshToonMaterial } from "three";

export default class Body {
    // collider: any; // TODO:
    public mesh: Mesh;
    // animations: any; // TODO:
    constructor() {
        // this.collider = null;
        this.mesh = this.createMesh();
        // this.animations = null;
    }

    createMesh(): Mesh {
        const playerGeometry = new BoxGeometry( 1,  1,  1 );
        const playerMaterial = new MeshToonMaterial( { color: 0x64495e } );
        const mesh: Mesh = new Mesh( playerGeometry, playerMaterial );
        mesh.position.z = 0.501;
        mesh.position.x = 4;
        mesh.position.y = 4;
        mesh.name = 'Player';

        const weaponGeometry = new BoxGeometry( 0.3,  0.3,  0.3 );
        const weaponMaterial = new MeshToonMaterial( { color: 0x64495e } );
        const weapon: Mesh = new Mesh( weaponGeometry, weaponMaterial );
        weapon.position.z = 0.501;
        weapon.position.x = 0;
        weapon.position.y = 0.6;
        weapon.name = 'Player weapon';
        mesh.add(weapon);

        return mesh;
    }

    move(position: {x: number, y: number, z: number}, rotation: {x: number, y: number, z: number}): void {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.rotation.x = rotation.x;
        this.mesh.rotation.y = rotation.y;
        this.mesh.rotation.z = rotation.z;
    }

    appendToScene(scene: Scene): void {
        scene.add(this.mesh);
    }
}
