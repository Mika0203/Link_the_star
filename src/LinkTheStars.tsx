import { render } from "@testing-library/react";
import { useEffect, useRef, useState } from "react";

interface LinkTheStarsProps {
    plateData: Array<Array<number>>
}

interface Coordinates {
    x: number,
    y: number
}

export default function LinkTheStars(data: LinkTheStarsProps) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const width: number = 300;
    const height: number = 300;

    const [matrix, setMatrix] = useState<Coordinates>({
        x: data.plateData[0].length,
        y: data.plateData.length
    });

    const [lineInterval, setLineInterval] = useState<Coordinates>(
        {
            x: width / data.plateData[0].length,
            y: height / data.plateData.length
        }
    );

    useEffect(() => {
        setMatrix({
            x: data.plateData[0].length,
            y: data.plateData.length
        });

        setLineInterval({
            x: width / data.plateData[0].length,
            y: height / data.plateData.length
        });
    }, [data.plateData, width, height]);

    const drawLine = () => {
        const context = canvas.current?.getContext('2d');
        if (context) {
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
        }
    };

    const drawStars = () => {
        const context = canvas.current?.getContext('2d');
        if (context) {
            data.plateData.forEach((row,y) => {
                row.forEach((col,x) => {
                    if(col == 0) return;
                    context.beginPath();
                    const center = getCenter(x, y);
                    context.fillText(col.toString(), center.x, center.y);
                    context.stroke();
                })
            })
        }

    };

    const getCenter = (x: number, y: number) => {
        return {
            x: x * lineInterval.x + lineInterval.x / 2,
            y: y * lineInterval.y + lineInterval.y / 2
        }
    }

    useEffect(() => {
        drawStars();
        drawLine();
    }, []);

    return <canvas ref={canvas} width={width} height={height} />
};
