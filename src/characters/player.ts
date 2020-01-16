import { Camera, Mesh } from "three";
import Body from "./body";
import Inputs from "./inputs";
import MoveController from "./move-controller";
import * as MathHelper from '../utils/math-helper';
import Store from "../store";

export default class Player {
    position: {x: number, y: number, z: number};
    rotation: {x: number, y: number, z: number};
    body: Body;
    collider: Mesh;
    inputs: Inputs;
    moveController: MoveController;
    camera: Camera | null;
    store: Store;

    constructor() {
        this.position = { x: 4, y: 4, z: 0};
        this.rotation = { x: 0, y: 0, z: 0};

        this.store = Store.getInstance();
        
        this.body = new Body();
        this.camera = null;
        this.inputs = new Inputs();
        this.moveController = new MoveController();
        
    }

    moveCamera(): void {
        if (this.camera) {
            this.camera.position.set( this.position.x, this.position.y, 15 );
            this.camera.lookAt( this.position.x, this.position.y, this.position.z );
        }
    }
    
    useCamera(camera: Camera): void {
        this.camera = camera;
    }

    update(deltaTime: number): void {
        this.rotation.z = this.inputs.getMouseRotation();

        let inputsState = this.inputs.getStates();
        if (inputsState.up || inputsState.down || inputsState.left || inputsState.right) {
            let newPosition = this.moveController.getNewPosition(this.position, inputsState, this.rotation.z, deltaTime);
            const moveDirection = MathHelper.calcAngleFromAxisY({x: newPosition.x - this.position.x, y: newPosition.y - this.position.y});
            const moveDirectionTitle = this.moveController.calcRelativeDirectionOfMovement(this.rotation.z, moveDirection);
            // TODO: вызов анимации
            // TODO: проверка колайдера
            this.position = newPosition; 
        }

        this.body.move(this.position, this.rotation);
        this.moveCamera();
    }
}
