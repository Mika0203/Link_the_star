import { Dir } from "fs";
import { Coordinates } from "./LinkTheStar";

interface NodeProps {
    parentNode?: Node,
    coordinate: Coordinates,
    starNumber: number,
    isRootNode: boolean
};

export default class Node {
    coordinates: Coordinates;
    starNumber: number;
    isRootNode: boolean;
    childNode?: Node;
    parentNode?: Node;
    isLinked: boolean;
    linkDirection: Coordinates;

    constructor(data: NodeProps) {
        this.coordinates = data.coordinate;
        this.starNumber = data.starNumber;
        this.isRootNode = data.isRootNode;
        this.isLinked = false;
        this.linkDirection = { x: 0, y: 0 };
    };

    setChild(targetNode: Node) {
        if (!targetNode.isRootNode) {
            // over distance
            if (!this.isCanLink(targetNode))
                return this;

            // if same number...?
            if (targetNode.starNumber === this.starNumber) {
                console.debug("Same Number.");
                return this.checkSameNumber(targetNode);
            }

            this.childNode = targetNode;
            targetNode.setParent(this);
        } else {

            // link star
            if (targetNode.starNumber === this.starNumber) {
                targetNode.setParent(this);
            }
        }

        return targetNode;
    };

    setParent(node: Node) {
        this.parentNode = node;

        this.setDirection();
        node.setDirection();

        if (this.isRootNode) {
            console.log('도착!')
            this.link();
            return;
        }

        this.starNumber = node.starNumber;
    };

    checkSameNumber(targetNode: Node): Node {
        console.log(targetNode)
        const [result, findNode] = targetNode.checkThisChild(this);

        // 1. check targetnode's children
        if (result) {
            // if contains this node => back targetnode
            console.debug('find node!', findNode);
            findNode?.childNode?.removeParent();
            return findNode || this;
        } else {
            console.debug("can't find node. link node");
            return this;
        }
        // else link that line

    };

    checkThisChild(targetNode: Node): [boolean, Node?] {
        let childNode: Node = this;

        while (childNode) {
            if (childNode === targetNode)
                return [true, this];
            else {
                if (childNode.childNode)
                    childNode = childNode.childNode;
                else
                    break;
            }
        }

        return [false, undefined];
    }

    isCanLink(targetNode: Node) {
        const x = Math.abs(targetNode.coordinates.x - this.coordinates.x);
        const y = Math.abs(targetNode.coordinates.y - this.coordinates.y);
        return !(x + y > 1);
    }

    removeParent() {
        this.childNode?.removeParent();
        this.reset();
    };

    reset() {
        this.starNumber = 0;
        this.parentNode = undefined;
        this.childNode = undefined;
    };

    link() {
        this.isLinked = true;
        this.parentNode?.link();
    };

    setDirection() {
        if (this.parentNode) {
            if (this.childNode) {
                const x = this.childNode.coordinates.x - this.parentNode.coordinates.x;
                const y = this.childNode.coordinates.y - this.parentNode.coordinates.y;

                if (Math.abs(x) === 2) {
                    this.linkDirection = { x: 2, y: 0 };
                } else if (Math.abs(y) === 2) {
                    this.linkDirection = { x: 0, y: 2 };
                } else {
                    const px = this.coordinates.x - this.parentNode.coordinates.x;
                    const py = this.coordinates.y - this.parentNode.coordinates.y;
                    const cx = this.coordinates.x - this.childNode.coordinates.x;
                    const cy = this.coordinates.y - this.childNode.coordinates.y;

                    // left
                    console.log(px)

                    if (px === 1)
                        this.linkDirection.x = -1;
                    else if (px === -1)
                        this.linkDirection.x = 1;
                    else if (cx === 1)
                        this.linkDirection.x = -1;
                    else if (cx === -1)
                        this.linkDirection.x = 1;

                    if (py === 1)
                        this.linkDirection.y = -1;
                    else if (py === -1)
                        this.linkDirection.y = 1;
                    else if (cy === 1)
                        this.linkDirection.y = -1;
                    else if (cy === -1)
                        this.linkDirection.y = 1;

                    /// py == 1 => left
                    /// px == -1 => right
                    /// px == 0 => up or down

                }

            } else {
                const x = this.parentNode.coordinates.x - this.coordinates.x;
                const y = this.parentNode.coordinates.y - this.coordinates.y;

                this.linkDirection.y = y;
                this.linkDirection.x = x;
            }
        }
    }
}