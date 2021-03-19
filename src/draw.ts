import { Coordinates } from "./LinkTheStar";

const drawTool = {
    DrawStar: (context: CanvasRenderingContext2D,
        centerPos: Coordinates,
        color: string,
        isFill: boolean) => {
        const radius = 5;
        const intervalLength = 20;

        const startPosition: Coordinates = {
            x: centerPos.x + radius,
            y: centerPos.y + radius
        };

        let currentPosition: Coordinates = startPosition;

        context.save();
        context.beginPath();

        context.lineWidth = 3;
        context.fillStyle = color;
        context.strokeStyle = color;

        const vertexes: Array<Array<Coordinates>> = [];

        for (let i = 0; i < 5; i++) {
            const nextPosition = rotate(currentPosition, 72, centerPos);
            vertexes.push([currentPosition, nextPosition]);
            currentPosition = nextPosition;
        }

        context.moveTo(vertexes[0][0].x, vertexes[0][0].y);
        
        vertexes.forEach(dot => {

            const centerOfVertex = getCenter(dot[0], dot[1]);

            const slope: number = getSlope(centerOfVertex, centerPos);
            let interval: Coordinates = getIntervalPoint(slope, intervalLength);

            if (centerOfVertex.x < centerPos.x) {
                interval.y *= -1
                interval.x *= -1
            }

            const reddotPos = {
                x: centerOfVertex.x + interval.x,
                y: centerOfVertex.y + interval.y
            }
            context.quadraticCurveTo(reddotPos.x, reddotPos.y, dot[1].x, dot[1].y);
        })

        isFill 
        ? context.fill() 
        : context.stroke();

        context.restore();

    },

    DrawPlate: (context: CanvasRenderingContext2D,
        width: number,
        height: number,
        matrix: Coordinates,
        lineInterval: Coordinates
    ) => {
        if (context) {  
            context.beginPath();
            context.save();
            context.fillStyle = 'black';
            context.fillRect(0, 0, width, height);
            context.restore();
            context.stroke();

            context.beginPath();
            context.save();

            context.strokeStyle = 'white';
            context.fillStyle = 'white';
            for (let i = 1; i <= matrix.y; i++) {
                context.moveTo(0, i * lineInterval.y);
                context.lineTo(width, i * lineInterval.y);
            }

            for (let i = 1; i <= matrix.x; i++) {
                context.moveTo(i * lineInterval.x, 0);
                context.lineTo(i * lineInterval.x, height);
            }

            context.rect(0, 0, width, height);
            context.stroke();
            context.restore();
        }
    },

    DrawLink: (
        context: CanvasRenderingContext2D, 
        centerPos: Coordinates, 
        color : string,
        linkDir : Coordinates,
        lineInterval: Coordinates,
        isFill: boolean,
        ) => {
        context.save();

        context.lineWidth = 5;
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineCap = "round";

        context.beginPath();
            
        const drawRight = () => {
            context.moveTo(centerPos.x, centerPos.y);
            context.lineTo(centerPos.x + lineInterval.x * 0.5, centerPos.y);
        }
        
        const drawLeft = () => {
            context.moveTo(centerPos.x, centerPos.y);
            context.lineTo(centerPos.x - lineInterval.x * 0.5, centerPos.y);
        }

        const drawUp = () => {
            context.moveTo(centerPos.x, centerPos.y);
            context.lineTo(centerPos.x, centerPos.y - lineInterval.y * 0.5);
        }

        const drawDown = () => {
            context.moveTo(centerPos.x, centerPos.y);
            context.lineTo(centerPos.x, centerPos.y + lineInterval.y * 0.5);
        }

        if(linkDir.x === 2) {
            drawRight();
            drawLeft();
        } else if(linkDir.x === 1){
            drawRight();
        } else if(linkDir.x === -1){
            drawLeft();
        }

        if(linkDir.y === 2) {
            drawUp();
            drawDown();
        } else if(linkDir.y === 1) {
            drawDown();
        } else if(linkDir.y === -1){
            drawUp();
        }

        context.stroke();
        context.restore();
    }
}

export default drawTool

const getIntervalPoint = (slope: number, length: number): Coordinates => {
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
};

const getCenter = (dot1: Coordinates, dot2: Coordinates): Coordinates => {
    return {
        x: (dot1.x + dot2.x) * 0.5,
        y: (dot1.y + dot2.y) * 0.5
    }
};

const getSlope = (p1: Coordinates, p2: Coordinates): number => {
    return (p2.y - p1.y) / (p2.x - p1.x);
};

const rotate = (start: Coordinates, degree: number, pivot: Coordinates): Coordinates => {
    return {
        x: (start.x - pivot.x) * Math.cos(degree * Math.PI / 180) - (start.y - pivot.y) * Math.sin(degree * Math.PI / 180) + pivot.x,
        y: (start.x - pivot.x) * Math.sin(degree * Math.PI / 180) + (start.y - pivot.y) * Math.cos(degree * Math.PI / 180) + pivot.y
    };
};