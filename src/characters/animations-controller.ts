import { AnimationMixer } from "three";

export interface IAnimationsController {
    changeTo(name: string): void;
    update(deltaTime: number) : void;
}

export default class AnimationsController implements IAnimationsController{
    mixer: AnimationMixer;
    list: Array<any>;
    current: string;

    constructor() {
        
    }

    changeTo(name: string): void {
        throw new Error("Method not implemented.");
    }
    update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
}