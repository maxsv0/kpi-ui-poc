import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KpiTree } from '../model/kpi-tree';
import { KpiService } from '../service/kpi.service';

@Component({
  selector: 'app-my-tree',
  templateUrl: './my-tree.component.html',
  styleUrls: ['./my-tree.component.scss']
})
export class MyTreeComponent {
  kpiTree: KpiTree;

  constructor(
      private activatedRoute: ActivatedRoute,
      private kpiService: KpiService
  ) {
      const treeId = this.activatedRoute.snapshot.params.treeID;

      this.kpiService.getKpiTree(treeId)
          .subscribe(response => {
              this.kpiTree = response.kpiTree;
              console.log("treeId=" + this.kpiTree);
          });
  }

}
