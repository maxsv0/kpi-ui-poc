import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {KpiService} from "../service/kpi.service";
import {KpiTree} from "../model/kpi-tree";

@Component({
    selector: 'app-kpi-tree',
    templateUrl: './kpi-tree.component.html',
    styleUrls: ['./kpi-tree.component.scss']
})

export class KpiTreeComponent implements OnInit {
    @Input() isReadOnly: boolean = true;

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

    ngOnInit() {

    }

}
