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

  constructor(private kpiService: KpiService) {
      this.kpiService.getKpiTreesList()
          .subscribe(response => {
              this.kpiTrees = response.kpiTrees;
          });
  }

}
