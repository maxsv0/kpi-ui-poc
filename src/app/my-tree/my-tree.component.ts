import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KpiTree } from '../model/kpi-tree';

@Component({
  selector: 'app-my-tree',
  templateUrl: './my-tree.component.html',
  styleUrls: ['./my-tree.component.scss']
})
export class MyTreeComponent {
  kpiTree: KpiTree;
  isNew: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    const treeId = this.activatedRoute.snapshot.params.treeID;
    this.isNew = treeId && treeId === 'new';
  }

}
