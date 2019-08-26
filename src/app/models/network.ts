import { Node } from "./node";

export class Network {
    constructor(private _nodes: Node[]) {
        this._nodes.forEach(node => {
            node.fillNodes(this._nodes.filter(x=>x.id !== node.id));
        });
    }

    public imitateWork(): void {
       this._nodes.forEach(node=> node.startToWork());
    }
}
