import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

class LoaderAssets {
    constructor() {
        this.isLoaded = false;
        this.FBXLoader = new FBXLoader();
        this.resources = [
        // models
        {
            type: 'model',
            name: 'character',
            url: 'build/assets/models/character.fbx',            
        },
        // {
        //     type: 'model',
        //     name: 'player',
        //     url: 'build/assets/models/player.fbx',            
        // },

        // [model]-[animation]-[weapons]
        

        // {
        //     type: 'animation',
        //     name: 'character-death-nogun',
        //     url: 'build/assets/models/character@death-nogun.fbx',            
        // },
        {
            type: 'animation',
            name: 'character-death-rifle',
            url: 'build/assets/models/character@death-rifle.fbx',            
        },

        // {
        //     type: 'animation',
        //     name: 'character-idle-nogun-run-backwards',
        //     url: 'build/assets/models/character@idle-nogun-run-backwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-idle-nogun-run-forwards',
        //     url: 'build/assets/models/character@idle-nogun-run-forwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-idle-nogun-stay',
        //     url: 'build/assets/models/character@idle-nogun-stay.fbx',            
        // },

        {
            type: 'animation',
            name: 'character-idle-rifle-run-backwards',
            url: 'build/assets/models/character@idle-rifle-run-backwards.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-backwards-left',
            url: 'build/assets/models/character@idle-rifle-run-backwards-left.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-backwards-right',
            url: 'build/assets/models/character@idle-rifle-run-backwards-right.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-forwards',
            url: 'build/assets/models/character@idle-rifle-run-forwards.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-forwards-left',
            url: 'build/assets/models/character@idle-rifle-run-forwards-left.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-forwards-right',
            url: 'build/assets/models/character@idle-rifle-run-forwards-right.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-left',
            url: 'build/assets/models/character@idle-rifle-run-left.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-run-right',
            url: 'build/assets/models/character@idle-rifle-run-right.fbx',            
        },
        {
            type: 'animation',
            name: 'character-idle-rifle-stay',
            url: 'build/assets/models/character@idle-rifle-stay.fbx',            
        },


        // {
        //     type: 'animation',
        //     name: 'character-reload-rifle-run-backwards',
        //     url: 'build/assets/models/character@reload-rifle-run-backwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-reload-rifle-run-forwards',
        //     url: 'build/assets/models/character@reload-rifle-run-forwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-reload-rifle-stay',
        //     url: 'build/assets/models/character@reload-rifle-stay.fbx',            
        // },

        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-backwards',
        //     url: 'build/assets/models/character@shoot-rifle-run-backwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-forwards',
        //     url: 'build/assets/models/character@shoot-rifle-run-forwards.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-right',
        //     url: 'build/assets/models/character@shoot-rifle-run-right.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-left',
        //     url: 'build/assets/models/character@shoot-rifle-run-left.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-backwards-right',
        //     url: 'build/assets/models/character@shoot-rifle-run-backwards-right.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-forwards-right',
        //     url: 'build/assets/models/character@shoot-rifle-run-forwards-right.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-backwards-left',
        //     url: 'build/assets/models/character@shoot-rifle-run-backwards-left.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-run-forwards-left',
        //     url: 'build/assets/models/character@shoot-rifle-run-forwards-left.fbx',            
        // },
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-stay',
        //     url: 'build/assets/models/character@shoot-rifle-stay.fbx',            
        // },
        
        ];
        this.resourcesLoaded = {
            models: {},
            animations: {}
        };
        this.load(this.resources).then(() => {
            this.isLoaded = true;
            const event = new Event('assetsLoaded');
            document.dispatchEvent(event);
        });
    }

    load(resources) {
        const promises = [];
        resources.forEach((item) => {
            switch(item.type) {
                case 'model': promises.push(this.loadModels(item, this.FBXLoader, this.resourcesLoaded.models));
                case 'animation': promises.push(this.loadModels(item, this.FBXLoader, this.resourcesLoaded.animations));
            }
        });
        return Promise.all(promises);
    }   

    loadModels(item, loader, target) {
        return new Promise((resolve) => {
            loader.load(item.url, function ( object ) {
                item.model = object;
                if (!target[item.name]) {
                    target[item.name] = object;
                } else {
                    console.error(`Model ${item.name} exist already. This will be overridden`);
                }
                
                resolve();
            });
        });
    }

    loadAnimation(item, loader, target) {
        return new Promise((resolve) => {
            loader.load(item.url, function ( object ) {
                item.model = object;
                if (!target[item.name]) {
                    target[item.name] = object;
                } else {
                    console.error(`Animation ${item.name} exist already. This will be overridden`);
                }
                
                resolve();
            });
        });
    }

    getAssets() {
        return this.resourcesLoaded;
    }

    onLoad(cb) {
        let self = this;
        if (this.isLoaded) {
            if (cb) {
                cb(this.resourcesLoaded);
            }
        } else {
            console.log('Not loaded, wait...');
            document.addEventListener('assetsLoaded', function (e) { cb(self.resourcesLoaded); }, false);
            console.log('Loading done!');
        }
        
    }
}

const Assets = new LoaderAssets();

export default Assets; 
