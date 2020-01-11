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
                    reload: '',
                    misfire: ''
                }
            }
        };

        // create a global audio source
        let soundFire = new THREE.Audio( this.listener );
        this.sounds.weapons.BerettaM9.fire = soundFire;
        this.audioLoader.load('build/assets/audio/weapon--beretta-m9--shoot.mp3', function( buffer ) {
            soundFire.setBuffer( buffer );
            soundFire.setVolume( 0.5 );
            soundFire.offset =  0.015;
        });

        let soundReload = new THREE.Audio( this.listener );
        this.sounds.weapons.BerettaM9.reload = soundReload;
        this.audioLoader.load('build/assets/audio/weapon--beretta-m9--reload.mp3', function( buffer ) {
            soundReload.setBuffer( buffer );
            soundReload.setVolume( 1 );
            soundReload.offset =  0;
        });

        let soundMisfire = new THREE.Audio( this.listener );
        this.sounds.weapons.BerettaM9.misfire = soundMisfire;
        this.audioLoader.load('build/assets/audio/weapon--beretta-m9--misfire.mp3', function( buffer ) {
            soundMisfire.setBuffer( buffer );
            soundMisfire.setVolume( 1 );
            soundMisfire.offset =  0;
        });

    }

}