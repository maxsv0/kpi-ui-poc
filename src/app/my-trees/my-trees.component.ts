import { Component, OnInit } from '@angular/core';
import { KpiTree } from '../model/kpi-tree';
import { AuthService } from '../service/auth.service';
import { KpiService } from '../service/kpi.service';

@Component({
  selector: 'app-my-trees',
  templateUrl: './my-trees.component.html',
  styleUrls: ['./my-trees.component.scss']
})
export class MyTreesComponent {

  kpiTrees: KpiTree[] = [];
  hasNoTrees: boolean = false;

  constructor(public kpiService: KpiService, private authService: AuthService) {
    // this.authService.auth().onAuth
    if (this.authService.isLogged()) {
      this.kpiService.getMyKpiTreesList()
        .subscribe(response => {
          this.kpiTrees = response.kpiTrees;
        });
    } else {
      this.hasNoTrees = true;
    }
  }

}
