import { Component, OnInit } from '@angular/core';
import { KpiTree } from '../model/kpi-tree';
import { KpiService } from '../service/kpi.service';

@Component({
  selector: 'app-my-trees',
  templateUrl: './my-trees.component.html',
  styleUrls: ['./my-trees.component.scss']
})
export class MyTreesComponent {

  kpiTrees: KpiTree[] = [];

  constructor(public kpiService: KpiService) {
      this.kpiService.getMyKpiTreesList()
          .subscribe(response => {
              this.kpiTrees = response.kpiTrees;
          });
  }

}
