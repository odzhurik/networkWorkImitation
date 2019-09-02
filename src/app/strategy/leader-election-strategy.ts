import { Node } from "../models/node";

export interface LeaderElectionStrategy {
    electLeader(node: Node): void;
}