import { promises, resolve } from "dns";

export type ResourcesType = 'model' | 'animation' | 'texture';

export default class Store {
    private static instance: Store;
    private resources: any;

    private constructor () {
        this.resources = {};
        // {
        //     type: 'animation',
        //     name: 'character-shoot-rifle-stay',
        //     url: 'build/assets/models/character@shoot-rifle-stay.fbx',            
        // },

        console.log('Store constructor');
    }

    public static getInstance(): Store {
        if (!Store.instance) { Store.instance = new Store(); }
        return Store.instance;
    }

    getResources(type: ResourcesType, url: string): Promise<string> {

        return new Promise(resolve => {
            setTimeout(() => {
                console.log(url);
                resolve('getResourcesByUrl done');
            }, 400); 
        })
    }

    doSomething(): void {
        console.log('doSomething');
    }

}