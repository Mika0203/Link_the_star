import { Coordinates } from "./LinkTheStar";

export const DrawStar = (context: CanvasRenderingContext2D, centerPos: Coordinates) => {
    const radius = 7;

    const startPosition : Coordinates = {
        x : centerPos.x + radius,
        y : centerPos.y + radius
    };

    let currentPosition : Coordinates = startPosition;
    
    context.beginPath();

    const vertexes : Array<Array<Coordinates>> = [];
    
    for(let i = 0 ; i < 5; i++){
        const nextPosition =  rotate(currentPosition, 72, centerPos);
        vertexes.push([currentPosition, nextPosition]);
        currentPosition = nextPosition;
    }

    vertexes.forEach(dot => {
        const centerOfVertex = getCenter(dot[0], dot[1]);

        const slope : number = getSlope(centerOfVertex, centerPos);
        let interval : Coordinates = getIntervalPoint(slope, 13);

        if (centerOfVertex.x < centerPos.x) {
            interval.y *= -1
            interval.x *= -1
        }

        const reddotPos = {
            x: centerOfVertex.x + interval.x,
            y: centerOfVertex.y + interval.y
        }

        context.moveTo(dot[0].x, dot[0].y);
        context.lineTo(reddotPos.x, reddotPos.y);
        context.lineTo(dot[1].x, dot[1].y);
    })

    context.stroke();
}

const getIntervalPoint = (slope : number, length : number) => {
    if (slope === Infinity) {

        return {
            x: 0,
            y: -length
        }
    } else if (slope === -Infinity) return {
        x: 0,
        y: length
    }

    return {
        x: length / Math.sqrt(1 + slope ** 2),
        y: length * slope / Math.sqrt(1 + slope ** 2)
    }
}

const getCenter = (dot1: Coordinates, dot2: Coordinates) => {
    const ret : Coordinates = {
        x: (dot1.x + dot2.x) * 0.5,
        y: (dot1.y + dot2.y) * 0.5
    }
    return ret;
};

const getSlope = (p1 : Coordinates , p2 : Coordinates) => {
    return (p2.y - p1.y) / (p2.x - p1.x);
}


const rotate = (start : Coordinates, degree : number, pivot : Coordinates) => {
    const ret : Coordinates = {
        x: (start.x - pivot.x) * Math.cos(degree * Math.PI / 180) - (start.y - pivot.y) * Math.sin(degree * Math.PI / 180) + pivot.x,
        y: (start.x - pivot.x) * Math.sin(degree * Math.PI / 180) + (start.y - pivot.y) * Math.cos(degree * Math.PI / 180) + pivot.y
    };
    return ret;
}