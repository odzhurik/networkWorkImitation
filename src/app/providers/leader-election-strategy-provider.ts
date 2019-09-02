import { LeaderElectionStrategyType } from "../enums/leader-election-strategy-type";
import { LeaderElectionStrategy } from "../strategy/leader-election-strategy";
import { BullyElection } from "../strategy/bully-election";
import { RingElection } from "../strategy/ring-election";

export class LeaderElectionStrategyProvider {
    public static getStrategy(strategyType: LeaderElectionStrategyType): LeaderElectionStrategy {
        if (strategyType === LeaderElectionStrategyType.bully) {
            return new BullyElection();
        }
        if (strategyType === LeaderElectionStrategyType.ring) {
            return new RingElection();
        }
        throw new Error(`${LeaderElectionStrategyType[strategyType]} isn't supported`);
    }
}