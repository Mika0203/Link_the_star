import { Coordinates } from "./LinkTheStar";

interface NodeProps {
    parentNode? : Node,
    coordinate : Coordinates,
    starNumber : number,
    isRootNode : boolean
};

enum Direction {
    NULL,
    HORIZONTAL,
    VERTICAL,
    LD,
    RD,
    LU,
    RU,
    CR,
    CL,
    CU,
    CD
}

export default class Node {
    coordinates : Coordinates;
    starNumber : number;
    isRootNode : boolean;
    childNode? : Node;
    parentNode? : Node;
    isLinked : boolean;
    linkDirection? : Direction;

    constructor(data : NodeProps){
        this.coordinates = data.coordinate;
        this.starNumber = data.starNumber;
        this.isRootNode = data.isRootNode;
        this.isLinked = false;
    };

    setChild(targetNode : Node){

        if(!targetNode.isRootNode)
        {
            // over distance
            if(!this.isCanLink(targetNode))
                return this;

            // if same number...?
            if(targetNode.starNumber === this.starNumber){
                console.debug("Same Number.");
                return this.checkSameNumber(targetNode);
            }
            
            this.childNode = targetNode;
            targetNode.setParent(this);
        };

        return targetNode;
    };

    setParent(node : Node) {
        this.parentNode = node;

        if(this.isRootNode){
            console.log('도착!')
            this.linked();
            return;
        }

        this.starNumber = node.starNumber;
    };

    checkSameNumber(targetNode : Node) : Node {
        console.log(targetNode)
        const [result, findNode] = targetNode.checkThisChild(this);

        // 1. check targetnode's children
        if(result) {
            // if contains this node => back targetnode
            console.debug('find node!',findNode);
            findNode?.childNode?.removeParent();
            return findNode || this;
        } else {
            console.debug("can't find node. link node");
            return this;
        }
        // else link that line

    };

    checkThisChild(targetNode : Node) : [boolean, Node?]{
        let childNode : Node = this;

        while(childNode){
            if(childNode === targetNode)
                return [true, this];
            else {
                if(childNode.childNode)
                    childNode = childNode.childNode;
                else 
                    break;
            }
        }
        
        return [false, undefined];
    }

    isCanLink(targetNode : Node) {
        const x = Math.abs(targetNode.coordinates.x - this.coordinates.x);
        const y = Math.abs(targetNode.coordinates.y - this.coordinates.y);
        return !(x + y > 1);
    }

    selectThisNode(){
    };

    removeParent(){
        this.childNode?.removeParent();
        this.reset();
    };

    reset() {
        this.starNumber = 0;
        this.parentNode = undefined;
        this.childNode = undefined;
    };

    linked(){
        this.isLinked = true;
        this.parentNode?.linked();
    }
}