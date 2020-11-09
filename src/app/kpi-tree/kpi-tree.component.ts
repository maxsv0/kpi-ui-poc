import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { KpiService } from "../service/kpi.service";
import { KpiTree } from "../model/kpi-tree";
import { getRandomUUID } from '../kpi-tree-tools';

@Component({
    selector: 'app-kpi-tree',
    templateUrl: './kpi-tree.component.html',
    styleUrls: ['./kpi-tree.component.scss']
})

export class KpiTreeComponent implements OnInit {
    @Input() isReadOnly: boolean = true;
    @Input() isNew: boolean = false;

    kpiTree: KpiTree;

    constructor(
        private activatedRoute: ActivatedRoute,
        private kpiService: KpiService
    ) {
        const treeId = this.activatedRoute.snapshot.params.treeID;
        this.isNew = treeId && treeId === 'new';

        if (!this.isNew) {
            this.kpiService.getKpiTree(treeId)
                .subscribe(response => {
                    this.kpiTree = response.kpiTree;
                    console.log("tree=" + this.kpiTree);
                });
        } else {
            const treeUId = getRandomUUID();
            const treeUIdRoot = getRandomUUID();
            const treeUIdRootChildOne = getRandomUUID();
            const treeUIdRootChildTwo = getRandomUUID();

            this.kpiTree = {
                "uid": treeUId,
                "name": "Sample Test Tree",
                "created": new Date().toString(),
                "kpi": [
                    {
                        "uid": treeUIdRoot,
                        "parentId": null,
                        "orderId": 1,
                        "title": "Sustainable Growth",
                        "style": "alert alert-danger",
                        "offsetTop": null
                    },
                    {
                        "uid": treeUIdRootChildOne,
                        "parentId": treeUIdRoot,
                        "orderId": 1,
                        "title": "Revenue (€)",
                        "style": "alert alert-primary",
                        "offsetTop": 0
                    },
                    {
                        "uid": treeUIdRootChildTwo,
                        "parentId": treeUIdRoot,
                        "orderId": 2,
                        "title": "Costs (€)",
                        "style": "alert alert-primary",
                        "offsetTop": 0
                    }
                ]
            }
        }
    }

    ngOnInit() {

    }

}
