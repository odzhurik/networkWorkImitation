import { Injectable } from '@angular/core';
import { Node } from '../models/node';

@Injectable()
export class NodeService {

    constructor() { }

    public createNetwork(): Node[] {
        let nodes = new Array<Node>();

        for (let i = 1; i <= 6; i++) {
            const node = new Node({ id: i, isLeader: i === 6 });
            nodes.push(node);
        }
        return nodes;
    }
}
