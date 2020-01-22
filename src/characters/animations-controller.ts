import { AnimationMixer, AnimationClip } from "three";
import Store from '../store';
import { AnimationAction } from "three/src/animation/AnimationAction";

export default interface AnimationsController {
    list: { [key: string]: any };
    init(animationsList: { [key: string]: string }[]): any;
    changeTo(name: string): void;
    update(deltaTime: number): void;
}

export default class AnimationsController implements AnimationsController{
    mixer: AnimationMixer;
    list: { [key: string]: any };
    current: string;
    store: Store;

    constructor(mixer: AnimationMixer) {
        this.mixer = mixer;
        this.list = {};
        this.current = null;
        this.store = Store.getInstance();
    }

    init(animationsList: { [key: string]: string; }[]): any {
        return new Promise((resolve) => {
            this.loadAnimations(animationsList).then(() => {
                this.changeTo('idle-rifle-stay');
                console.log(this.mixer);
                resolve();
            })
        });
    }

    loadAnimations(animationsList: { [key: string]: string; }[]): any {
        const promises: any = [];
        animationsList.forEach((animation) => {
            promises.push(this.store.getResource(animation.url, 'animation').then((data) => {
                // костыль, потмоу что у типа Group почему то нет поля animations, хотя он есть
                let content: any = data.content;
                let animationClip  = content.animations[0];
                
                this.list[animation.name] = this.mixer.clipAction(animationClip);
                this.list[animation.name].play();
                this.list[animation.name].enabled = true;
                this.list[animation.name].setEffectiveTimeScale( 1 );
                this.list[animation.name].setEffectiveWeight( 0 );
                this.list[animation.name].name = animation.name;
            })); 
        });
        return Promise.all(promises);
    }

    changeTo(nextAnimation: string): void {

        function setWeight( action: AnimationAction, weight: number ): void {
            action.enabled = true;
            action.setEffectiveTimeScale( 1 );
            action.setEffectiveWeight( weight );
        }

        function crossFade( startAction: AnimationAction, endAction: AnimationAction, duration: number ): void {
            let timerId: any = null;
            let step = 0;
            const totalSteps = 10;

            step = 0;
            clearInterval(timerId);
            timerId = setInterval(() => {
                step++;
                setWeight(startAction, 1 - step/totalSteps);
                setWeight(endAction, step/totalSteps);
                if (step >= totalSteps) {
                    clearInterval(timerId);
                }
            }, duration * 1000 / totalSteps);
        }
        
        if (nextAnimation !== this.current) {
            if (this.list[nextAnimation]) {
                if (this.current == null) {
                    this.current = nextAnimation;
                    setWeight( this.list[this.current], 1 )
                } else {
                    crossFade( this.list[this.current], this.list[nextAnimation], 0.2 );
                    this.current = nextAnimation;
                }
            } else {
                console.error(`Animation not found ${nextAnimation}`);
            }
        }
    }

    update(deltaTime: number): void {
        throw new Error("Method not implemented.");
    }
}