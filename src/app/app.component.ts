import { Component, OnInit } from '@angular/core';
import { NodeService } from './services/node.service';
import { Node } from './models/node';
import { Network } from './models/network';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public nodes: Node[];
  public network: Network;
  constructor(private nodeService: NodeService){}

  public ngOnInit(): void {
    this.nodes = this.nodeService.createNetwork();
    this.network = new Network(this.nodes);
    this.network.imitateWork();
  }
}
