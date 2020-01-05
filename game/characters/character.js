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
                shoot: false,
                reload: false,
                death: false
            },
            movement: {
                stay: false,
                // walk: false,
                run: false,
            },
            direction: {
                forwards: false,
                backwards: false
            },
            weapons: {
                nogun: false,
                // pistol: false,
                rifle: false
            },
        };
        this.mixer;

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
        // - "reload-rifle-run-backwards"  костыль из "reload-rifle-stay"
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
            animationsList[animationName] = this.mixer.clipAction(this.assets.animations[animationName].animations[0]);
        });
        return animationsList;
    }

    createCollaider() {
        let collaider;
        const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 2, 12 ); 
        // const material = new THREE.MeshLambertMaterial( { color: 0x00ff00, side: THREE.BackSide } );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
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

        // + "death-nogun"
        // + "death-rifle"
        // + "idle-nogun-run-backwards"
        // + "idle-nogun-run-forwards"
        // + "idle-nogun-stay"
        // + "idle-rifle-run-backwards"
        // + "idle-rifle-run-forwards"
        // + "idle-rifle-stay"
        // - "reload-rifle-run-backwards"  костыль из "reload-rifle-stay"
        // - "reload-rifle-run-forwards"  костыль из "reload-rifle-stay"
        // + "reload-rifle-stay"
        // - "shoot-rifle-run-backwards"  костыль из "shoot-rifle-run-forwards"
        // + "shoot-rifle-run-forwards"
        // + "shoot-rifle-stay" 
        
        // direction
        if (this.states.direction.forwards) { direction = '-forwards'; } 
        if (this.states.direction.backwards) { direction = '-backwards'; } 

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
        if (this.states.actions.reload) { actions = '-reload'; } 
        if (this.states.actions.shoot) { actions = '-shoot'; } 

        // weapon
        if (this.states.weapons.nogun) { weapon = '-nogun'; } 
        if (this.states.weapons.rifle) { weapon = '-rifle'; } 
        
        let nextAnimation = `${animations}${actions}${weapon}${movement}${direction}`;

        if (this.animations[nextAnimation]) {
            this.animateStop();
            this.animations[nextAnimation].play();
            console.log(`Active animation is ${nextAnimation}`);
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