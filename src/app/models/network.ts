import { Node } from "./node";

export class Network {
    constructor(public nodes: Node[]) {
        this.nodes.forEach(node => {
            node.fillNodes(this.nodes.filter(x=>x.id !== node.id));
        });
    }

    public imitateWork(): void {
       this.nodes.forEach(node=> node.startToWork());
    }
}
