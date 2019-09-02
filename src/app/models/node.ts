import { LeaderElectionStrategy } from "../strategy/leader-election-strategy";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

export class Node {
    public id: number;
    public isLeader: boolean;

    public get nodes(): Node[] {
        return this._nodes;
    }

    public get enabledNodes(): Node[] {
        return this._nodes.filter(x => x.enabled);
    }

    public enabled: boolean;

    public get leader(): Node {
        return this.nodes.find(x => x.isLeader);
    }

    public get leaderElectionStrategy(): LeaderElectionStrategy {
        return this._leaderElectionStrategy;
    }

    public set leaderElectionStrategy(strategy: LeaderElectionStrategy) {
        this._leaderElectionStrategy = strategy;
    }

    private workId: number;
    private _nodes: Node[];
    private _leaderElectionStrategy: LeaderElectionStrategy;

    constructor(init?: Partial<Node>) {
        Object.assign(this, init);
    }

    public sendRequest(): void {
        try {
            this.leader.getRequest(this.id);
        } catch (e) {
            if (this.leaderElectionStrategy) {
                this.stopWorking();
                this.enabledNodes.forEach(node => node.stopWorking());

                console.log(`Machine #${this.id} starts an election of new leader`);
                this.leaderElectionStrategy.electLeader(this);
            }
        }
    }

    public fillNodes(nodes: Node[]): void {
        this._nodes = nodes;
    }

    public startToWork(): void {
        if (!this.isLeader && this.enabled) {
            let interval = Math.floor(Math.random() * 100000) + 10000;
            this.workId = window.setInterval(() => {
                console.log(`Machine #${this.id} starts to work...`);
                this.sendRequest();
            }, interval);
        }
    }

    public stopWorking(): void {
        window.clearInterval(this.workId);
        console.log(`Machine ${this.id} stops calls to leader`);
    }

    public disableNode(): void {
        this.enabled = false;
    }

    public getRequest(nodeId: number, message: string = null): boolean {
        if (this.isLeader) {
            if (!this.enabled) {
                throw new Error("Not respond");
            }
            console.log(`${nodeId} asks #${this.id}`);
            return true;
        } else if (this.enabled) {
            console.log(`Machine #${this.id} receives request from #${nodeId}`);
            return true;
        }
    }
}
