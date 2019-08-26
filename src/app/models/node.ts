
export class Node {
    public id: number;
    public isLeader: boolean;
    public nodes: Node[];
    private workId: number;
    private _capacity: number = 3;

    constructor(init?: Partial<Node>) {
        Object.assign(this, init);
    }

    public async sendRequest(): Promise<void> {
        try {
            const leaderNode = this.nodes.find(x => x.isLeader);
            await leaderNode.getRequest(this.id.toString());
        } catch (e) {
            this.resumeWork();
            this.nodes.forEach(node => node.resumeWork());
            console.log(`Machine #${this.id} starts an election of new leader`);
            this.bullyElection();
        }
    }

    public fillNodes(nodes: Node[]): void {
        this.nodes = nodes;
    }

    public startToWork(): void {
        if (!this.isLeader) {
            let interval = Math.floor(Math.random() * 100000) + 10000;
            this.workId = window.setInterval(() => {
                console.log(`Machine #${this.id} starts to work...`);
                this.sendRequest();
            }, interval);
        }
    }

    public resumeWork(): void {
        window.clearInterval(this.workId);
        console.log(`Machine ${this.id} resumes calls to leader`);
    }

    public bullyElection(): void {
        const nodesGreaterCurrent = this.nodes.filter(x => x.id > this.id).slice(0, 2);
        this.sendRequestToNextNodes(this, nodesGreaterCurrent);
    }

    private async sendRequestToNextNodes(currentNode: Node, nodes: Node[]) {
        for (let i = 0; i < nodes.length; i++) {
            let current = nodes[i];
            await current.getRequest(currentNode.toString())
                .then(async () =>
                    await this.sendRequestToNextNodes(current,
                        current.nodes.filter(x => x.id > current.id).slice(0, 2)))
                .catch(() => {
                    currentNode.isLeader = true;
                    console.log(`Machine #${currentNode.id} is leader now`);
                    currentNode.nodes.forEach(node => {
                        node.isLeader = false;
                        node.startToWork();
                    })
                })
        }
    }

    public getRequest(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isLeader) {
                if (this._capacity < 0) {
                    return reject(new Error("Not respond"));
                }

                console.log(`${message} asks #${this.id}`);
                this._capacity--;
            }
            else {
                console.log(`Machine #${this.id} receives request from #${message}`);
                resolve();
            }
        });

    }
}
