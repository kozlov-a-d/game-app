import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Group } from 'three';

export type ResourceType = 'model' | 'animation' | 'texture';

export type Resource = {
    id?: number;
    type: ResourceType;
    name?: string;
    url: string;
    isLoaded: boolean;
    content: Group;
    callback: () => void;
};

export default interface Store {
    getResource(type: ResourceType, url: string): Promise<Resource>; 
}

export default class Store implements Store {
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

    public getResource(url: string, type: ResourceType): Promise<Resource> {
        return new Promise(resolve => {
            const exist = this.findResourcesInStore(url, type);
            let resource: Resource = null;

            if (exist == null) {
                // если ресурса нет, то добавляем его в список и начинаем загружать
                resource = this.createResourceTemplate(url, type);
                this.resources.push(resource);
                resolve(this.load(resource));
                
            } else {
                // если ресурс уже есть, то проверяем загружен ли он
                if (exist.isLoaded) {
                    resolve(exist); // если да, то сразу отадем загруженый ресурс
                } else {
                    exist.callback = (): void => { resolve(exist); } // если нет, то надо ждать пока другой промис его загрузит и потом отдать
                }
            }
        })
    }

    private findResourcesInStore(url: string, type: ResourceType): Resource | null {
        let resource = null;
        this.resources.forEach((item) => {
            if (item.url == url && item.type == type) {
                resource = item;
            }
        });
        return resource;
    }

    private createResourceTemplate(url: string, type: ResourceType): Resource {
        return {
            type: type,
            url: url,
            isLoaded: false,
            content: null,
            callback: null
        }
    }

    private load(resource: Resource): Promise<Resource> {
        switch(resource.type) {
            case 'model': return this.loadModel(resource);
            case 'animation': return this.loadAnimation(resource);
        }
    }   

    private loadModel(resource: Resource): Promise<Resource> {
        return new Promise((resolve) => {
            this.loaders.fbx.load(resource.url, ( object ) => {
                resource.content = object;
                resource.isLoaded = true;
                resolve(resource); 
                resource.callback();
            });
        });        
    }

    private loadAnimation(resource: Resource): Promise<Resource> {
        return new Promise((resolve) => {
            this.loaders.fbx.load(resource.url, function( object ) {
                resource.content = object;
                resource.isLoaded = true;
                resolve(resource); 
                resource.callback();
            });
        });        
    }
}
