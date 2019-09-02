import { Component, OnInit } from '@angular/core';
import { NodeService } from './services/node.service';
import { Network } from './models/network';
import { LeaderElectionStrategyType } from './enums/leader-election-strategy-type';
import { LeaderElectionStrategyProvider } from './providers/leader-election-strategy-provider';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public network: Network;
    public leaderElectionStrategyType = LeaderElectionStrategyType;

    public get showToChooseStrategy(): boolean {
        return !this.network.nodes.find(x => x.isLeader).enabled;
    }

    constructor(private nodeService: NodeService) { }

    public ngOnInit(): void {
        const nodes = this.nodeService.createNetwork();
        this.network = new Network(nodes);
        this.network.imitateWork();
    }

    public onDisableLeaderClick(): void {
        this.network.nodes.find(x => x.isLeader).disableNode();
    }

    public onElectionStrategyChange(value: LeaderElectionStrategyType): void {
        this.network.nodes.forEach(node => {
            const electionStrategy = LeaderElectionStrategyProvider.getStrategy(value);
            node.leaderElectionStrategy = electionStrategy;
        });
    }
}
