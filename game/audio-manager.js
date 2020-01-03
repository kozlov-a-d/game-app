import * as THREE from 'three';

export default class AudioManager {
    constructor(camera){
        // create an AudioListener and add it to the camera
        this.listener = new THREE.AudioListener();
        camera.add( this.listener );

        // load a sound and set it as the Audio object's buffer
        this.audioLoader = new THREE.AudioLoader();

        this.sounds = {
            weapons: {
                BerettaM9: {
                    fire: '',
                    reload: ''
                }
            }
        };

        // create a global audio source
        let sound = new THREE.Audio( this.listener );
        this.sounds.weapons.BerettaM9.fire = sound;

        this.audioLoader.load("./build/audio/weapon--beretta-m9--shoot.mp3", function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume( 0.5 );
            sound.offset =  0.015;
            console.log('loaded');
        });

    }

}