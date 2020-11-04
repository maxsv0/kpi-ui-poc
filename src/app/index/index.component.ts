import {Component, OnInit} from '@angular/core';
import 'leader-line';
import { KpiTree } from '../model/kpi-tree';
import { AuthService } from '../service/auth.service';
import { KpiService } from '../service/kpi.service';


@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

    public kpiTree: KpiTree;

    constructor(public authService: AuthService, public kpiService: KpiService) {}

    ngOnInit() {
        const sampleTreeId = "d33033bd-50b1-4133-a658-783bc705d7cb";
        this.kpiService.getKpiTree(sampleTreeId)
            .subscribe(response => {
                this.kpiTree = response.kpiTree;
            });
    }

}
