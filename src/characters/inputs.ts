export default class Inputs {
    // states: {up: boolean, down: boolean, left: boolean, right: boolean, reload: boolean, fire: boolean};
    states: any; // TODO: разобраться какого хера
    keyMap: any;
    coordMouse: { x: number, y: number};
    coordScreenCenter: { x: number, y: number};
    rotation: number;

    constructor() {
        this.states = {
            up: false,
            down: false,
            left: false,
            right: false,
            reload: false,
            fire: false,
        }
        this.rotation = 0;
        this.keyMap = new Map([
            [37,'left'],  // arrow left
            [39,'right'], // arrow right
            [38,'up'],    // arrow up
            [40,'down'],  // arrow down
            [65,'left'],  // a
            [68,'right'], // d
            [87,'up'],    // w
            [83,'down'],  // s
            [82,'reload'],   // reload
            [32,'fire']   // space
        ]);
        this.coordMouse = { x: 0, y: 0 }; 
        this.coordScreenCenter = { x: 0, y: 0 }; 

        this.calcCoordScreenCenter();
        window.addEventListener('resize', this.calcCoordScreenCenter.bind(this));
        
        
        document.addEventListener('keydown', (event) => this.updateKey(event, true));
        document.addEventListener('keyup', (event) => this.updateKey(event, false));
        document.addEventListener('mousemove', (event) => this.updateMouse(event));
        document.addEventListener('click', (event) => {
            event.preventDefault();
            return false;
        });
    }

    calcCoordScreenCenter(): void {
        this.coordScreenCenter.x = window.innerWidth/2;
        this.coordScreenCenter.y = window.innerHeight/2;
    }

    updateKey(event: KeyboardEvent, pressed: boolean): void {
        if(this.keyMap.has(event.keyCode)) {
            event.preventDefault();
            event.stopPropagation();
            const stateKey = this.keyMap.get(event.keyCode);
            if (this.states[stateKey]) {
                this.states[stateKey] = pressed;
            }
        }
    }

    updateMouse(event: MouseEvent): void {
        this.coordMouse.x = event.clientX - window.innerWidth/2;
        this.coordMouse.y = - event.clientY + window.innerHeight/2;
        this.rotation = this.calcMouseRotation(this.coordMouse.x, this.coordMouse.y);
    }

    calcMouseRotation(x: number, y: number): number {
        // console.log(Math.PI * 2 - (Math.atan2(x, y) + Math.PI));
        // console.log(x, y);
        return(Math.atan2(x, -y) + Math.PI); 
    }

    getMouseRotation(): number {
        return this.rotation;
    }

    getStates(): any {
        return this.states;
    }
}
