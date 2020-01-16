import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export type ResourceType = 'model' | 'animation' | 'texture';

export type Resource = {
    id?: number,
    type: ResourceType,
    name?: string,
    url: string,
    isLoaded: boolean,
    content: any
};

interface IStore {
    // getResources(type: ResourceType, url: string): Promise<string> 
}

export default class Store implements IStore {
    private static instance: Store;
    private resources: Array<Resource>;
    private loaders: {fbx: FBXLoader}

    private constructor () {
        this.resources = [];
        this.loaders = {
            fbx: new FBXLoader()
        }
    }

    public static getInstance(): Store {
        if (!Store.instance) { Store.instance = new Store(); }
        return Store.instance;
    }

    private findResourcesInStoreByURL(url: string): Resource | null {
        let resources = null;
        this.resources.forEach((item, index) => {
            if (item.url === url) return item;
        });
        return resources;
    }

    getResources(url: string, type: ResourceType): Promise<Resource> {
        let exist = this.findResourcesInStoreByURL(url);
        console.log(exist);
        
        return new Promise(resolve => {
            if (exist !== null) {
                resolve(exist)
            } else {
                resolve(this.load(url, type));
            };
        })
    }

    load(url: string, type: ResourceType): Promise<Resource> {
        switch(type) {
            case 'model': return this.loadModels(url);
            // case 'animation': this.loadModels(item, this.FBXLoader, this.resourcesLoaded.animations);
        }
    }   

    loadModels(url: string): Promise<Resource> {
        let resource: Resource = null;
        return new Promise((resolve) => {
            resource = {
                type: 'model',
                url: url,
                isLoaded: false,
                content: null
            }
            this.loaders.fbx.load(url, function ( object ) {
                resource.content = object;
                resource.isLoaded = true;
                resolve(resource); 
            });
        });        
       
    }

}