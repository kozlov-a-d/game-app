import * as MathHelper from '../utils/math-helper';

export default interface ActionsController {
}

export default class ActionsController implements ActionsController {
    speed: number;
    constructor() {
        this.speed = 10;
    }

    public getNewPosition(currentPosition: {x: number; y: number; z: number}, inputsState: { [key: string]: boolean }, angle: number, deltaTime: number): {x: number; y: number; z: number} {
        const distance = this.speed / 1000 * deltaTime;
        const newPosition = {
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

    public calcRelativeDirectionOfMovement(meshDirection: number, moveDirection: number): string {
        const deltaDirection = MathHelper.RadianToDegree( meshDirection - moveDirection );
        const direction = MathHelper.calcRelativeDirection( deltaDirection );

        return direction;
    }

}
