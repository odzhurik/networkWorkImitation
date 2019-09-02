import { LeaderElectionStrategy } from "./leader-election-strategy";
import { Node } from "../models/node";

export class RingElection implements LeaderElectionStrategy {
    private message: string = '';
    private _startNode: Node;
    constructor() { }
    public electLeader(node: Node): void {
        console.log("Ring election strategy");
        this._startNode = node;
        this.sendRingElectionMessage(node, node.enabledNodes);
    }

    private sendRingElectionMessage(currentNode: Node, nodes: Node[]): void {
        this.message = this.message.concat(",", currentNode.id.toString());
        for (let node of nodes) {
            const response = node.getRequest(currentNode.id);
            if (response) {
                if (this._startNode.id === node.id) {
                    const maxId = Math.max.apply(null, this.message.split(',').map(x => Number(x)));
                    let nodeWithMaxId = node.nodes.find(x => x.id === maxId);
                    if (nodeWithMaxId) {
                        nodeWithMaxId.isLeader = true;
                    } else {
                        node.isLeader = true;
                    }

                    console.log(`Machine #${maxId} is leader now`);

                    node.nodes.filter(x => x.id !== maxId).forEach(x => {
                        x.isLeader = false;
                        x.startToWork();
                    });
                    return;
                }
                this.message = this.message.concat(",", node.id.toString());
            }
        }
        this.sendRingElectionMessage(nodes[0], nodes[0].enabledNodes);
    }

}