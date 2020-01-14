import { Camera } from "three";
import Body from "./body";
import Inputs from "./inputs";
import MoveController from "./move-controller";
import * as MathHelper from '../utils/math-helper';

export default class Player {
    position: {x: number, y: number, z: number};
    rotation: {x: number, y: number, z: number};
    body: Body;
    inputs: Inputs;
    moveController: MoveController;
    camera: Camera | null;

    constructor() {
        this.position = { x: 4, y: 4, z: 0};
        this.rotation = { x: 0, y: 0, z: 0};

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
        let newPosition = this.moveController.getNewPosition(this.position, this.inputs.getStates(), deltaTime);
        const moveDirection = MathHelper.calcAngleFromAxisY({x: newPosition.x - this.position.x, y: newPosition.y - this.position.y});
        // TODO: проверка направления движения персонажа относительно направления взягляда
        const moveDirectionTitle = this.moveController.calcRelativeDirectionOfMovement(this.rotation.z, moveDirection);
        console.log(this.rotation.z, moveDirection, moveDirectionTitle);
        // TODO: вызов анимации
        // TODO: проверка колайдера 
        this.position = newPosition; 

        this.body.move(this.position, this.rotation);
        this.moveCamera();
    }
}
