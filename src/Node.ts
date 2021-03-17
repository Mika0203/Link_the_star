import { Coordinates } from "./LinkTheStar";

interface NodeProps {
    parentNode? : Node,
    coordinate : Coordinates,
    starNumber : number,
    isRootNode : boolean
};

export default class Node {
    coordinates : Coordinates;
    starNumber : number;
    isRootNode : boolean;
    childNode? : Node;
    parentNode? : Node;
    isLinked : boolean;

    constructor(data : NodeProps){
        this.coordinates = data.coordinate;
        this.starNumber = data.starNumber;
        this.isRootNode = data.isRootNode;
        this.isLinked = false;
    };

    setChild(targetNode : Node){
        if(!targetNode.isRootNode 
            || targetNode.starNumber === this.starNumber){
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

    selectThisNode(){
    };

    linked(){
        this.isLinked = true;
        this.parentNode?.linked();
    }
}