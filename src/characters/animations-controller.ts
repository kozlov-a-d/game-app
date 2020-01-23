import { AnimationMixer, AnimationClip } from "three";
import Store from '../store';
import Utils from "../utils";
import { AnimationAction } from "three/src/animation/AnimationAction";

export default interface AnimationsController {
    list: { [key: string]: any };
    init(animationsList: { [key: string]: string }[]): Promise<void>;
    changeTo(name: string): void;
    update(deltaTime: number): void;
}

export default class AnimationsController implements AnimationsController{
    mixer: AnimationMixer;
    list: { [key: string]: any };
    current: string;

    constructor(mixer: AnimationMixer) {
        this.mixer = mixer;
        this.list = {};
        this.current = null;
    }

    init(animationsList: { [key: string]: string }[]): Promise<void> {
        return new Promise((resolve) => {
            this.loadAnimations(animationsList).then(() => {
                this.changeTo('idle-rifle-stay');
                resolve();
            })
        });
    }

    loadAnimations(animationsList: { [key: string]: string }[]): Promise<Promise<void>[]> {
        const promises: any = [];
        animationsList.forEach((animation) => {
            promises.push(Store.getInstance().getResource(animation.url, 'animation').then((data) => {
                // костыль, потому что у типа Group почему то нет поля animations, хотя он есть
                const content: any = data.content;
                const animationClip: AnimationClip = content.animations[0];
                this.list[animation.name] = this.createAnimationActionFromClip(animationClip);
            })); 
        });
        return Promise.all(promises);
    }

    private createAnimationActionFromClip(clip: AnimationClip): AnimationAction {
        const action = this.mixer.clipAction(clip);
        action.play();
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
        action.setEffectiveWeight( 0 );
        return action;
    }

    changeTo(nextAnimation: string): void {
        if (nextAnimation !== this.current) {
            if (this.list[nextAnimation]) {
                if (this.current == null) {
                    this.current = nextAnimation;
                    Utils.three.animationSetWeight( this.list[this.current], 1 )
                } else {
                    Utils.three.animationsCrossFade( this.list[this.current], this.list[nextAnimation], 0.2 );
                    this.current = nextAnimation;
                }
            } else {
                console.error(`Animation not found ${nextAnimation}`);
            }
        }
    }

    update(deltaTime: number): void {
        if ( deltaTime > 0 ) {
            this.mixer.update( deltaTime/1000 );
        }
    }
}
