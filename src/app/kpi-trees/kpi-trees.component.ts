import {Component, OnInit} from '@angular/core';
import {KpiService} from "../service/kpi.service";
import {KpiTree} from "../model/kpi-tree";

@Component({
    selector: 'app-kpi-trees',
    templateUrl: './kpi-trees.component.html',
    styleUrls: ['./kpi-trees.component.scss']
})
export class KpiTreesComponent implements OnInit {

    kpiTrees: KpiTree[] = [];

    constructor(private kpiService: KpiService) {
        this.kpiService.getKpiTreesList()
            .subscribe(response => {
                this.kpiTrees = response.kpiTrees;

                console.log(this.kpiTrees);
            });
    }

    ngOnInit(): void {
    }

}
