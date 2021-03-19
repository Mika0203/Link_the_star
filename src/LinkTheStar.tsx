import { useCallback, useEffect, useRef, useState } from "react";
import Node from './Node';
import drawTool from './draw';

const colors = [
    'red',
    'blue',
    'white',
    'yellow',
    'purple'
]
interface LinkTheStarsProps {
    plateData: Array<Array<number>>
}

export interface Coordinates {
    x: number,
    y: number
}

export default function LinkTheStars(data: LinkTheStarsProps) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const width: number = 300;
    const height: number = 300;

    const [nodeList, setNodeList] = useState<Array<Array<Node>>>([]);

    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

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

    const [mousePos, setMousePos] = useState<Coordinates>({
        x: 0,
        y: 0
    });

    const [currentMouseNode, setCurrentMouseNode] = useState<Node>();

    const [selectedNode, setSelectedNode] = useState<Node>();

    const getCenter = useCallback((x: number, y: number) => {
        const ret : Coordinates = {
            x: x * lineInterval.x + lineInterval.x / 2,
            y: y * lineInterval.y + lineInterval.y / 2
        }
        return ret
    }, [lineInterval]);


    const renderStars = () => {
        const context = canvas.current?.getContext('2d');

        if (context) {
            context.save();
            context.clearRect(0,0,width,height);
            context && drawTool.DrawPlate(context, width, height, matrix, lineInterval);

            nodeList.forEach(row => {
                row.forEach(node => {
                    if (node.starNumber === 0) return;

                    const center : Coordinates = getCenter(node.coordinates.x, node.coordinates.y);
                    node.isRootNode 
                        ? drawTool.DrawStar(context, center, colors[node.starNumber], node.isLinked)
                        : drawTool.DrawLink(context, center, colors[node.starNumber], node.linkDirection, lineInterval, node.isLinked)
                })
            })
        }
    }

    useEffect(() => {
        renderStars();
    }, [nodeList, getCenter]);

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            setMousePos({
                x: event.clientX,
                y: event.clientY
            });
        };

        canvas.current?.addEventListener('mousemove', onMouseMove);

        return () => {
            canvas.current?.removeEventListener('mousemove', onMouseMove);
        }
    }, []);

    useEffect(() => {
        const x = Math.floor(mousePos.x / lineInterval.x);
        const y = Math.floor(mousePos.y / lineInterval.y);

        if (x > -1 && y > -1 && x < matrix.x && y < matrix.y && nodeList.length > 0) {
            const node = nodeList[y][x];
            setCurrentMouseNode(node);
        }

    }, [mousePos, lineInterval, matrix, nodeList]);

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

            
    const InitNodes = useCallback(() => {
        const nodes: Array<Array<Node>> = [];
        data.plateData.forEach((row, y) => {
            const nodeRow: Array<Node> = [];
            row.forEach((col, x) => {
                nodeRow.push(new Node({
                    coordinate: { x, y },
                    starNumber: col,
                    isRootNode: col !== 0
                }))
            })
            nodes.push(nodeRow);
        })
        setNodeList(nodes);
    }, [data.plateData]);
    

    useEffect(() => {
        InitNodes();
    }, [InitNodes]);

    useEffect(() => {
        if(selectedNode !== currentMouseNode && currentMouseNode && isMouseDown && selectedNode){

            // 되돌아가는거 처리해야함.
            const nextNode:Node = selectedNode?.setChild(currentMouseNode);
            setSelectedNode(nextNode);
            renderStars();
            console.log(selectedNode, currentMouseNode);
        }
    },[currentMouseNode, nodeList]);


    const onMouseDown = () => {
        setIsMouseDown(true);
        setSelectedNode(currentMouseNode);
    }

    const onMouseUp = () => {
        setIsMouseDown(false);
        setSelectedNode(undefined);
    }

    const onMouseMove = (event: any) => {
        setMousePos({
            x: event.clientX,
            y: event.clientY
        });
    }

    return <canvas
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        ref={canvas}
        width={width}
        height={height} />
};
