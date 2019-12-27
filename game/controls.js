export default class Controls {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.fire = false;
        this.direction = 0;
        this.keyMap = new Map([
            [37,'left'],  // arrow left
            [39,'right'], // arrow right
            [38,'up'],    // arrow up
            [40,'down'],  // arrow down
            [65,'left'],  // a
            [68,'right'], // d
            [87,'up'],    // w
            [83,'down'],  // s
            [32,'fire']   // space
        ]);
        this.coord = { mouse: {}, center: {} }; 

        this.calcCoordCenter();
        window.addEventListener('resize', this.calcCoordCenter.bind(this)); 
        
        document.addEventListener('keydown', (event) => this.updateKey(event, true));
        document.addEventListener('keyup', (event) => this.updateKey(event, false));
        document.addEventListener('mousemove', (event) => this.updateMouse(event));
    }

    calcCoordCenter() {
        this.coord.center.x = window.innerWidth/2;
        this.coord.center.y = window.innerHeight/2;
    }

    updateKey(event, pressed) {
        if(this.keyMap.has(event.keyCode)) {
            event.preventDefault();
            event.stopPropagation();
            this[this.keyMap.get(event.keyCode)] = pressed;
        }
    }

    updateMouse(event) {
        this.coord.mouse.x = event.clientX - window.innerWidth/2;
        this.coord.mouse.y = event.clientY - window.innerHeight/2;
        // let mX = this.coord.mouse.x - 0;
        // let mY = this.coord.mouse.y - 0;
        this.direction = Math.atan2(this.coord.mouse.x, this.coord.mouse.y) + Math.PI;
        // console.log(Math.atan2(this.coord.mouse.x, this.coord.mouse.y) / (Math.PI / 180));
    }
}