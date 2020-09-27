import {Component, OnInit} from '@angular/core';
import 'leader-line';
import {KpiService} from "../service/kpi.service";


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    kpiTrees = [];

    treeId = 'dd33033bd-50b1-4133-a658-783bc705d7cb';

    constructor(private kpiService: KpiService) {
        // this.kpiService.getKpiTreesList()
        //     .subscribe(response => {
        //         this.kpiTrees = response.kpiTrees;
        //
        //         console.log(this.kpiTrees);
        //     });
    }

    ngOnInit() {

    }

}
