import { Camera, Mesh, Scene } from "three";
import Body from "./body";
import Inputs from "./inputs";
import Controller from "./controller";
import * as MathHelper from '../utils/math-helper';
import Store from "../store";
import AnimationsController from "./animations-controller";

export default class Player {
    position: {x: number, y: number, z: number};
    rotation: {x: number, y: number, z: number};
    body: Body;
    collider: Mesh;
    inputs: Inputs;
    moveController: Controller;
    camera: Camera | null;
    store: Store;
    config: any;
    animationsController: AnimationsController

    constructor() {
        this.position = { x: 4, y: 4, z: 0};
        this.rotation = { x: 270 * Math.PI/180, y: 0, z: 180 * Math.PI/180};

        this.config = {
            resources: {
                model: 'src/assets/models/character.fbx',
                animations: [
                    { url: 'character@shoot-rifle-run-forwards.fbx', name: 'shoot-rifle-run-forwards'},
                    { url: 'character@shoot-rifle-run-forwards-right.fbx', name: 'shoot-rifle-run-forwards-right'},
                    { url: 'character@shoot-rifle-run-forwards-left.fbx', name: 'shoot-rifle-run-forwards-left'},
                    { url: 'character@shoot-rifle-run-right.fbx', name: 'shoot-rifle-run-right'},
                    { url: 'character@shoot-rifle-run-left.fbx', name: 'shoot-rifle-run-left'},
                    { url: 'character@shoot-rifle-run-backwards.fbx', name: 'shoot-rifle-run-backwards'},
                    { url: 'character@shoot-rifle-run-backwards-right.fbx', name: 'shoot-rifle-run-backwards-right'},
                    { url: 'character@shoot-rifle-run-backwards-left.fbx', name: 'shoot-rifle-run-backwards-left'}
                ],
                audio: ''
            }
        }

        // может тогда ресурсы прям тут грузить, а дальше прокидывать уже загруженные объекты?

        this.store = Store.getInstance();
        this.body = new Body(this.config.resources.model, this.config.resources.animations);
        this.camera = null;
        this.camera = null;
        this.inputs = new Inputs();
        this.moveController = new Controller();
        this.animationsController = new AnimationsController();
    }

    init(scene: Scene, camera: Camera): Promise<Player> {
        return new Promise((resolve) => {
            this.body.init().then(() => {
                this.body.appendToScene(scene);
                this.useCamera(camera);
                this.setPosition(18, 18, 1.201);
                resolve(this)
            });
        });
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

    move(inputsState: { [key: string]: boolean; }, deltaTime: number): void {
        if (inputsState.up || inputsState.down || inputsState.left || inputsState.right) {
            let newPosition = this.moveController.getNewPosition(this.position, inputsState, this.rotation.y, deltaTime);
            const moveDirection = MathHelper.calcAngleFromAxisY({x: newPosition.x - this.position.x, y: newPosition.y - this.position.y});
            const moveDirectionTitle = this.moveController.calcRelativeDirectionOfMovement(this.rotation.y, moveDirection);
            // TODO: вызов анимации по moveDirectionTitle
            // TODO: проверка колайдера
            this.position = newPosition; 
        }
    }

    update(deltaTime: number): void {
        this.rotation.y = -this.inputs.getMouseRotation();
        this.move(this.inputs.getStates(), deltaTime);
        this.body.move(this.position, this.rotation);
        this.moveCamera();
    }

    setPosition(x: number, y: number, z: number): void {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
}
