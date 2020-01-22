// const DegreeToRadianKoef = 1 / Math.PI;
export const RadianToDegreeKoef: number = 1 / (Math.PI/180);

export function calcAngleFromAxisY (vectorA: {x: number; y: number}): number {
    // переворачиваем по Оси Y, пока до конца не понял почему)
    return Math.atan2(vectorA.x, -vectorA.y) + Math.PI;
}

export function RadianToDegree (angle: number): number {
    return angle*RadianToDegreeKoef;
}

export function calcRelativeDirection (deltaDirection: number): string {
    let direction = '';
    
    if (deltaDirection < 0 ) { deltaDirection = deltaDirection + 360; }
    if (deltaDirection < 0 ) { deltaDirection = deltaDirection + 360; }

    if (0 <= deltaDirection && deltaDirection <= 22.5) { direction = 'forwards'; }
    if (22.5 <= deltaDirection && deltaDirection <= 67.5) { direction = 'forwards-right'; }
    if (67.5 <= deltaDirection && deltaDirection <= 112.5) { direction = 'right'; }
    if (112.5 <= deltaDirection && deltaDirection <= 157.5) { direction = 'backwards-right'; }
    if (157.5 <= deltaDirection && deltaDirection <= 202.5) { direction = 'backwards'; }
    if (202.5 <= deltaDirection && deltaDirection <= 247.5) { direction = 'backwards-left'; }
    if (247.5 <= deltaDirection && deltaDirection <= 292.5) { direction = 'left'; }
    if (292.5 <= deltaDirection && deltaDirection <= 337.5) { direction = 'forwards-left'; }
    if (337.5 <= deltaDirection && deltaDirection <= 360) { direction = 'forwards'; }

    return direction;
}
