import { Mesh, Camera } from "three";
import Body from "./body";
import Inputs from "./inputs";
import PlayerController from "./controls";

export default class Player {
    position: {x: number, y: number, z: number};
    rotation: {x: number, y: number, z: number};
    body: Body;
    inputs: Inputs;
    // controller: PlayerController;
    camera: Camera | null;

    constructor() {
        this.position = { x: 4, y: 4, z: 0};
        this.rotation = { x: 0, y: 0, z: 0};

        this.inputs = new Inputs();
        // this.controller = new PlayerController();
        this.body = new Body();
        this.camera = null;
    }

    moveCamera(): void {
        if (this.camera) {
            // this.camera.position.set( this.position.x, this.position.y - 5, 15 );
            this.camera.position.set( this.position.x, this.position.y, 15 );
            this.camera.lookAt( this.position.x, this.position.y, this.position.z );
        }
    }
    
    useCamera(camera: Camera): void {
        this.camera = camera;
    }

    update(deltaTime: number): void {

        this.rotation.z = this.inputs.getMouseRotation();
        this.body.move(this.position, this.rotation);
        // console.log(this.rotation.z / (Math.PI/180) , this.inputs.getMouseRotation() / (Math.PI/180));
        this.moveCamera();
    }
}
