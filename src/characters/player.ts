import { Camera, Mesh, Scene, AnimationMixer } from "three";
import Body from "./body";
import Inputs from "./inputs";
import ActionsController from "./actions-controller";
import AnimationsController from "./animations-controller";
import Utils from '../utils/';
import Store from "../store";

export default class Player {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    body: Body;
    collider: Mesh;
    inputs: Inputs;
    animations: AnimationsController;
    actions: ActionsController;
    camera: Camera | null;
    config: { resources: { model: string; animations: Array<{ [key: string]: string }>; audio: string }};

    constructor() {
        this.position = { x: 4, y: 4, z: 0};
        this.rotation = { x: Utils.math.DegreeToRadian(270), y: 0, z: Utils.math.DegreeToRadian(180)};
        const path = 'build/assets/models/';
        this.config = {
            resources: {
                model: path + 'character.fbx',
                animations: [
                    { url: path + 'character@idle-rifle-stay.fbx', name: 'idle-rifle-stay'},
                    { url: path + 'character@shoot-rifle-run-forwards.fbx', name: 'shoot-rifle-run-forwards'},
                    { url: path + 'character@shoot-rifle-run-forwards-right.fbx', name: 'shoot-rifle-run-forwards-right'},
                    { url: path + 'character@shoot-rifle-run-forwards-left.fbx', name: 'shoot-rifle-run-forwards-left'},
                    { url: path + 'character@shoot-rifle-run-right.fbx', name: 'shoot-rifle-run-right'},
                    { url: path + 'character@shoot-rifle-run-left.fbx', name: 'shoot-rifle-run-left'},
                    { url: path + 'character@shoot-rifle-run-backwards.fbx', name: 'shoot-rifle-run-backwards'},
                    { url: path + 'character@shoot-rifle-run-backwards-right.fbx', name: 'shoot-rifle-run-backwards-right'},
                    { url: path + 'character@shoot-rifle-run-backwards-left.fbx', name: 'shoot-rifle-run-backwards-left'}
                ],
                audio: ''
            }
        }

        this.inputs = new Inputs();
        this.animations = null;
        this.actions = new ActionsController();
    }

    init(scene: Scene, camera: Camera): Promise<Player> {
        return new Promise((resolve) => {
            Store.getInstance().getResource(this.config.resources.model, 'model').then((data) => {
                const model = Utils.three.cloneSkinnedMeshes(data.content);
                this.body = new Body(model);
                scene.add(this.body.mesh);
                this.useCamera(camera);
                this.setPosition(18, 18, 0.001);

                this.animations = new AnimationsController(new AnimationMixer(model));
                this.loadAnimations(this.config.resources.animations).then(() => {
                    resolve(this);
                }); 
               
            });
        });
    }

    private loadAnimations(animations: { [key: string]: string }[]): Promise<void> {
        return this.animations.init(animations);
    }

    moveCamera(): void {
        if (this.camera) {
            this.camera.position.set( this.position.x, this.position.y - 5, 15 );
            this.camera.lookAt( this.position.x, this.position.y, this.position.z );
        }
    }
    
    useCamera(camera: Camera): void {
        this.camera = camera;
    }

    move(inputsState: { [key: string]: boolean }, deltaTime: number): void {
        if (inputsState.up || inputsState.down || inputsState.left || inputsState.right) {
            const newPosition = this.actions.getNewPosition(this.position, inputsState, this.rotation.y, deltaTime);
            const moveDirection = Utils.math.calcAngleFromAxisY({x: newPosition.x - this.position.x, y: newPosition.y - this.position.y});
            const moveDirectionTitle = this.actions.calcRelativeDirectionOfMovement(this.rotation.y, moveDirection);
            // TODO: проверка колайдера

            // вызов анимации по moveDirectionTitle
            this.animations.changeTo('shoot-rifle-run-' + moveDirectionTitle);
            this.position = newPosition; 
        } else {
            this.animations.changeTo('idle-rifle-stay');
        }
    }

    update(deltaTime: number): void {
        this.rotation.y = -this.inputs.getMouseRotation();
        this.move(this.inputs.getStates(), deltaTime);
        this.body.move(this.position, this.rotation);
        this.animations.update(deltaTime);
        this.moveCamera();
    }

    setPosition(x: number, y: number, z: number): void {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
}
