import * as THREE from 'three';
import Assets from '../loader-assets';

export default class Character {
    constructor(name, model = 'character', animations = 'character') {
        // this.assets = new LoaderAssets().getAssets();
        this.assets = Assets.getAssets();
        console.log('Character.js resources', this.assets);
        this.name = name;
        this.animationsScope = animations;
        this.states = {
            actions: {
                idle: false,
                // shoot: false,
                // reload: false,
                death: false
            },
            movement: {
                stay: false,
                // walk: false,
                run: false,
            },
            direction: {
                forwards: false,
                'forwards-right': false,
                'forwards-left': false,
                backwards: false,
                'backwards-right': false,
                'backwards-left': false,
                right: false,
                left: false,
            },
            weapons: {
                nogun: false,
                // pistol: false,
                rifle: false
            },
        };
        this.mixer;
        this.animationCurrent = null;

        this.mesh = this.createMesh(model);
        this.animations = this.createAnimations(this.animationsScope);
        this.collaider = this.createCollaider();

        this.activateState('actions', 'idle');
        this.activateState('movement', 'stay');
        this.activateState('direction', 'forwards');
        this.activateState('weapons', 'nogun');

        this.mixer.update( 0 );
        console.log(this.mixer);
    }

    appendToScene(scene) {
        scene.add(this.mesh);
        scene.add(this.collaider);
    }

    createMesh(model) {
        let mesh;
        let object = this.assets.models[model];
        
        this.mixer = new THREE.AnimationMixer( object );

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        let scaleModify = 0.013;
        object.scale.x = scaleModify;
        object.scale.y = scaleModify;
        object.scale.z = scaleModify;
        object.rotation.z = 180 * Math.PI/180;
        object.rotation.x = 270 * Math.PI/180;

        object = object;
        object.name = `${this.name}`;
        return object;
    }

    createAnimations(animations) {
        // + "death-nogun"
        // + "death-rifle"
        // + "idle-nogun-run-backwards"
        // + "idle-nogun-run-forwards"
        // + "idle-nogun-stay"
        // + "idle-rifle-run-backwards"
        // + "idle-rifle-run-forwards"
        // + "idle-rifle-stay"
        // - "reload-rifle-run-backwards" костыль из "reload-rifle-stay"
        // - "reload-rifle-run-forwards"  костыль из "reload-rifle-stay"
        // + "reload-rifle-stay"
        // - "shoot-rifle-run-backwards"  костыль из "shoot-rifle-run-forwards"
        // + "shoot-rifle-run-forwards"
        // + "shoot-rifle-stay" 

        let animationsList = {};
        let animationsNameList = [];
        
        for (let movement in this.states.movement) {
            // стоя на месте мне не нужны направления
            if (movement !== 'stay') {
                // если двигаемся
                for (let direction in this.states.direction) {
                    for (let weapon in this.states.weapons) {
                        for (let actions in this.states.actions) {
                            // не можем стрелять и перезаряжаться без оружия
                            if (!(
                                (weapon == 'nogun' && actions == 'shoot' ) ||
                                (weapon == 'nogun' && actions == 'reload')
                            )) {

                                // умираем пока что внезависимости от движения и направления
                                // костыльнем убрав сместь в движение
                                if (actions == 'death') {
                                    if (movement == 'stay') {
                                        animationsNameList.push(`${animations}-${actions}-${weapon}`);
                                    }
                                } else {
                                    animationsNameList.push(`${animations}-${actions}-${weapon}-${movement}-${direction}`);
                                }
                            }
                        };
                    };
                };
            } else {
                // если НЕ двигаемся
                for (let weapon in this.states.weapons) {
                    for (let actions in this.states.actions) {
                        // не можем стрелять и перезаряжаться без оружия
                        if (!(
                            (weapon == 'nogun' && actions == 'shoot' ) ||
                            (weapon == 'nogun' && actions == 'reload')
                        )) {
                            // умираем пока что внезависимости от движения и направления
                            // костыльнем убрав сместь в движение
                            if (actions == 'death') {
                                if (movement == 'stay') {
                                    animationsNameList.push(`${animations}-${actions}-${weapon}`);
                                }
                            } else {
                                animationsNameList.push(`${animations}-${actions}-${weapon}-${movement}`);
                            }
                        }
                    };
                };
            }
        };
        // console.log(animationsNameList.sort());
        animationsNameList.forEach((animationName) => {
            console.log(animationName);
            if(this.assets.animations[animationName]) {
                animationsList[animationName] = this.mixer.clipAction(this.assets.animations[animationName].animations[0]);
                animationsList[animationName].play();
                animationsList[animationName].enabled = true;
                animationsList[animationName].setEffectiveTimeScale( 1 );
                animationsList[animationName].setEffectiveWeight( 0 );
                animationsList[animationName].name = animationName;
            }
        });
        return animationsList;
    }

    createCollaider() {
        let collaider;
        const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 2, 12 ); 
        // const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, side: THREE.BackSide } );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
        material.transparent = true;
        material.opacity = 0.0;
        collaider = new THREE.Mesh( geometry, material );
        collaider.name = `${this.name} collaider`;
        collaider.rotateX(Math.PI/2);
        collaider.scale.multiplyScalar(1.05);
        return collaider;
    }

    activateState(type, key) {
        if (typeof this.states[type][key] == "boolean") {
            for (let index in this.states[type]) {
                this.states[type][index] = false;
            }
            this.states[type][key] = true;
            this.onStateChange();
        } else {
            console.log(`State ${key} not found in ${type}`, this.states);
        }
    }

    onStateChange() {
        // console.log(this.states);
        this.animateSwitch();
    }

    animateStop() {
        for (let key in this.animations) {
            this.animations[key].stop();
        }
    }

    animateSwitch(){
        let animations = this.animationsScope;
        let actions = '';
        let weapon = '';
        let movement = '';
        let direction = '-forwards';
        
        // direction
        if (this.states.direction.forwards) { direction = '-forwards'; } 
        if (this.states.direction['forwards-right']) { direction = '-forwards-right'; } 
        if (this.states.direction['forwards-left']) { direction = '-forwards-left'; } 
        if (this.states.direction.right) { direction = '-right'; } 
        if (this.states.direction.backwards) { direction = '-backwards'; } 
        if (this.states.direction['backwards-left']) { direction = '-backwards-left'; } 
        if (this.states.direction['backwards-right']) { direction = '-backwards-right'; } 
        if (this.states.direction.left) { direction = '-left'; } 

        // movement
        if (this.states.movement.stay) { 
            movement = '-stay'; 
            direction = '';
        } 
        if (this.states.movement.run) { movement = '-run'; } 

        // actions
        if (this.states.actions.death) { 
            actions = '-death'; 
            movement = '';
            direction = '';
        }
        if (this.states.actions.idle) { actions = '-idle'; } 
        // if (this.states.actions.reload) { actions = '-reload'; } 
        if (this.states.actions.reload) { actions = '-idle'; } 
        // if (this.states.actions.shoot) { actions = '-shoot'; } 
        if (this.states.actions.shoot) { actions = '-idle'; } 

        // weapon
        // if (this.states.weapons.nogun) { weapon = '-nogun'; } 
        if (this.states.weapons.nogun) { weapon = '-rifle'; } 
        if (this.states.weapons.rifle) { weapon = '-rifle'; } 
        
        let nextAnimation = `${animations}${actions}${weapon}${movement}${direction}`;

        // let timerId;
        // let step;
        // let self = this;
        // const totalSteps = 10;

        function setWeight( action, weight ) {
            action.enabled = true;
            action.setEffectiveTimeScale( 1 );
            action.setEffectiveWeight( weight );
        }

        function crossFade( startAction, endAction, duration ) {
            let timerId;
            let step = 0;
            let totalSteps = 10;

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
        

        if (this.animations[nextAnimation]) {
            if (this.animationCurrent == null) {
                this.animationCurrent = nextAnimation;
                setWeight( this.animations[this.animationCurrent], 1 )
            } else {
                crossFade( this.animations[this.animationCurrent], this.animations[nextAnimation], 0.2 );
                this.animationCurrent = nextAnimation;
            }
            // console.log(`Active animation is ${nextAnimation}`);
        } else {
            console.error(`Animation not found ${nextAnimation}`);
        }
    }

    setPosition(x, y, z) {
        this.collaider.position.x = x;
        this.collaider.position.y = y;
        this.collaider.position.z = z;
        if (this.mesh) {
            this.mesh.position.x = x;
            this.mesh.position.y = y;
            // this.mesh.position.z = z;
        }
    }

    move(deltaTime) {
        
    }

    update(deltaTime) {
        // console.log(deltaTime);
        if (this.mesh) {
            this.mesh.position.x = this.collaider.position.x;
            this.mesh.position.y = this.collaider.position.y;
        }

        let delta = deltaTime/1000;
        if ( this.mixer && delta > 0 ) {
            this.mixer.update( delta );
        };

        this.move(delta);
    }

    
}