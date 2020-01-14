import * as MathHelper from '../utils/math-helper';

export default class MoveController {
    speed: number;
    constructor() {
        this.speed = 10;
    }

    public getNewPosition(currentPosition: {x: number, y: number, z :number}, inputsState: { [key: string]: boolean; }, deltaTime: number): {x: number, y: number, z :number} {
        const distance = this.speed / 1000 * deltaTime;
        let newPosition = {
            x: currentPosition.x,
            y: currentPosition.y,
            z: currentPosition.z,
        };
        // TODO: перемещение не учитывает угол движения
        if (inputsState.up) { newPosition.y += distance; }
        if (inputsState.down) { newPosition.y -= distance; }
        if (inputsState.left) { newPosition.x -= distance; }
        if (inputsState.right) { newPosition.x += distance; }

        return newPosition;
    }

    calcRelativeDirectionOfMovement(meshDirection:number, moveDirection:number):string {
        let direction = 'forwards';
        let deltaDirection = MathHelper.RadianToDegree( Math.abs(meshDirection - moveDirection) );
        if (22.5 <= deltaDirection && deltaDirection <= 67.5) { direction = 'forwards-right'; }
        if (67.5 <= deltaDirection && deltaDirection <= 112.5) { direction = 'right'; }
        if (112.5 <= deltaDirection && deltaDirection <= 157.5) { direction = 'backwards-right'; }
        if (157.5 <= deltaDirection && deltaDirection <= 202.5) { direction = 'backwards'; }
        if (202.5 <= deltaDirection && deltaDirection <= 247.5) { direction = 'backwards-left'; }
        if (247.5 <= deltaDirection && deltaDirection <= 292.5) { direction = 'left'; }
        if (292.5 <= deltaDirection && deltaDirection <= 337.5) { direction = 'forwards-left'; }
        return direction;
    }

}
