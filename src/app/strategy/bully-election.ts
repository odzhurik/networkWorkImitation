import { LeaderElectionStrategy } from "./leader-election-strategy";
import { Node } from "../models/node";

export class BullyElection implements LeaderElectionStrategy {
    constructor(){}
    public electLeader(node: Node): void {
        console.log("Bully election strategy");
        const nodesGreaterCurrent = node.nodes.filter(x => x.id > node.id);
        this.sendRequestToNextNodes(node, nodesGreaterCurrent);
    }

    private sendRequestToNextNodes(currentNode: Node, nodes: Node[]) {
        try {
            for (let node of nodes) {
                const response = node.getRequest(currentNode.id);
                if (response) {
                    this.sendRequestToNextNodes(node,
                        node.nodes.filter(x => x.id > node.id));
                }
            }
        } catch (ex) {
            currentNode.isLeader = true;
            console.log(`Machine #${currentNode.id} is leader now`);
            currentNode.nodes.forEach(node => {
                node.isLeader = false;
                node.startToWork();
            })
        }
    }

}