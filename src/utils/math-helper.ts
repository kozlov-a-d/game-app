// const DegreeToRadianKoef = 1 / Math.PI;
export const RadianToDegreeKoef: number = 1 / (Math.PI/180);

export function calcAngleFromAxisY (vectorA: {x: number, y: number}) : number {
    // переворачиваем по Оси Y, пока до конца не понял почему)
    return Math.atan2(vectorA.x, -vectorA.y) + Math.PI;
}

export function RadianToDegree (angle: number) : number {
    return angle*RadianToDegreeKoef;
}
