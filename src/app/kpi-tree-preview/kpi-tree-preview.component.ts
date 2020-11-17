import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {KpiTree} from "../model/kpi-tree";
import {Kpi} from "../model/kpi";
import {
    getRandomUUID, highlightKpiByUid,
    highlightResetKpiByUid,
    KpiTreeConfig
} from "../kpi-tree-tools";
import {KpiRecursive} from "../model/kpi-recursive";
import {KpiService} from '../service/kpi.service';

declare let LeaderLine: any;

let kpiTreeConfig = new KpiTreeConfig();

@Component({
    selector: 'app-kpi-tree-preview',
    templateUrl: './kpi-tree-preview.component.html',
    styleUrls: ['./kpi-tree-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KpiTreePreviewComponent implements OnInit, OnDestroy {

    lines = [];
    offset = 75;
    offsetTop = 700;
    offsetLeft = 275;
    maxDepth = -1;

    @Input("kpiTree") kpiTree: KpiTree;
    @Input("isReadOnly") isReadOnly: boolean = false;
    @Input("hasNoTitle") hasNoTitle: boolean = false;
    @Input("isNew") isNew: boolean = false;

    public showTitle: boolean = false;
    public kpiTreeConfig: KpiTreeConfig = kpiTreeConfig;
    public selectedKpiChanges: Kpi | null = null;

    constructor(public kpiService: KpiService) { }

    ngOnDestroy() {
        this.removeKpiTree();
    }

    ngOnInit() {
        console.log('input tree=', this.kpiTree);

        kpiTreeConfig.kpiTree = this.kpiTree;
        this.showTitle = this.kpiTree && !this.hasNoTitle;

        this.initKpiTreeRecursive();
    }

    addKpi() {
        this.kpiService.addNewKpi(kpiTreeConfig.selectKpiId, kpiTreeConfig.kpiTree.uid).subscribe(kpisConfig => {
            kpiTreeConfig.kpiTree = kpisConfig.kpiTree;

            this.removeKpiTree();

            this.initKpiTreeRecursive();
        })
    }

    moveKpiSelected(offset: number) {
        const kpi = this.getSelectedKpi();

        kpi.offsetTop += offset;

        this.drawTree();

        this.kpiService.saveKpi(kpi, kpiTreeConfig.kpiTree.uid);
    }

    removeKpiSelected() {
        let kpi = this.getKpiByUid(kpiTreeConfig.selectKpiId);

        if (kpi != null && kpi.parentId !== null) {
            let kpiParent = this.getKpiByUid(kpi.parentId);

            if (kpiParent != null) {
                const newKpi = [];
                for (const kpiChild of kpiParent.children) {
                    if (kpiChild.uid !== kpiTreeConfig.selectKpiId) {
                        newKpi.push(kpi);
                    }
                }

                kpiParent.children = newKpi;

                this.drawTree();
            }
        }
    }

    removeKpiTree() {
        const treeDiv = document.getElementById('kpitree');
        if (treeDiv) {
            treeDiv.innerHTML = '';
        }

        for (const line of this.lines) {
            line.remove();
        }
        this.lines = [];
    }

    initKpiTreeRecursive() {
        const nest = (items, uid = null, link = 'parentId') =>
            items
                .filter(item => item[link] === uid)
                .map(item => ({ ...item, children: nest(items, item.uid) }));

        kpiTreeConfig.kpiTreeRecursive = nest(kpiTreeConfig.kpiTree.kpi);

        this.createTreeKpiIndex(kpiTreeConfig.kpiTreeRecursive[0]);

        this.drawTree();
    }

    getSelectedKpi(): KpiRecursive {
        return this.getKpiByUid(kpiTreeConfig.selectKpiId);
    }

    getKpiByUid(id: string): KpiRecursive {
        const found = kpiTreeConfig.kpiTreeIndex.find(element => element.id === id);

        return found !== null && found !== undefined ? found.kpi : found;
    }

    createTreeKpiIndex(leaf: KpiRecursive) {
        kpiTreeConfig.kpiTreeIndex.push({"id": leaf.uid, "kpi": leaf});

        for (const item of leaf.children) {
            this.createTreeKpiIndex(item);
        }
    }

    drawTree() {
        this.removeKpiTree();

        this.drawTreeLeaf(kpiTreeConfig.kpiTreeRecursive[0], kpiTreeConfig.kpiTreeRecursive[0], 0, this.maxDepth, this.offsetTop);

        if (kpiTreeConfig.selectKpiId != null) {
            highlightKpiByUid(kpiTreeConfig.selectKpiId);
        }
    }

    addKpiChildren(parentUid: string) {
        let child1 = new Kpi();
        child1.orderId = 1;
        child1.title = 'Next Level KPI';
        child1.parentId = parentUid;
        child1.style = 'alert alert-success';
        child1.uid = getRandomUUID();
        child1.offsetTop = 0;

        let child2 = new Kpi();
        child2.orderId = 2;
        child2.title = 'Next Level KPI';
        child2.parentId = parentUid;
        child2.style = 'alert alert-success';
        child2.uid = getRandomUUID();
        child2.offsetTop = 0;

        kpiTreeConfig.kpiTree.kpi.push(child1, child2);
    }

    drawTreeLeaf(leaf: KpiRecursive, root: KpiRecursive, depth: number, maxDepth: number, topOffset: number) {

        // console.log(depth, leaf.uid, leaf.title, topOffset + leaf.offsetTop);
        this.drawTreeLeafKpi(leaf, root, depth, topOffset + leaf.offsetTop, this.isReadOnly);

        if (maxDepth != -1 && depth > maxDepth) return;

        if (leaf.children != null) {
            let topOffsetNew = topOffset - ((leaf.children.length - 1) * this.offset / 2);

            leaf.children.sort((a, b) => {
                return a.orderId - b.orderId;
            });

            for (const item of leaf.children) {
                this.drawTreeLeaf(item, root, depth + 1, maxDepth, topOffsetNew + leaf.offsetTop);
                topOffsetNew += this.offset;

                this.lines.push(new LeaderLine(
                    document.getElementById('kpi-' + leaf.uid),
                    document.getElementById('kpi-' + item.uid),
                    { color: '#83b4e5', size: 1, path: 'grid', endPlugSize: 2, dash: true}
                ));
            }
        }
    }

    drawTreeLeafKpi(leaf: KpiRecursive, root: KpiRecursive, index: number, topOffset: number, isReadOnly: boolean) {
        const tree = document.getElementById('kpitree');

        const div = document.createElement('div');

        div.className = 'kpi text-center ' + leaf.style;
        div.id = 'kpi-' + leaf.uid;
        div.innerHTML = `${leaf.title} ${leaf.symbol ? '<span class="kpi-symbol">' + leaf.symbol + '</span>' : ''}`;
        div.style.top = topOffset + 'px';
        div.style.left = (50 + this.offsetLeft * index + (index === 0 ? 0 : 50)) + 'px';
        div.setAttribute('data-id', leaf.uid);
        div.setAttribute('data-parent-id', leaf.parentId);
        div.setAttribute('data-is-read-only', String(this.isReadOnly));
        div.setAttribute('data-toggle', "modal");
        div.setAttribute('data-target', "#modal");

        // div.addEventListener('mouseover', ($event) => this.kpiMouseOverListener($event));
        div.addEventListener('click', ($event) => this.kpiClickListener($event, this));

        tree.appendChild(div);
    }

    kpiMouseOverListener(event) {
        const thisDiv = event.target;

        if (kpiTreeConfig.focusKpiId != null) {
            const divActive = document.getElementById('kpi-' + kpiTreeConfig.focusKpiId);
            if (divActive != null) {
                divActive.classList.remove('kpi-active');
            }
        }

        if (thisDiv.dataset.id != null) {
            const div = document.getElementById('kpi-' + thisDiv.dataset.id);
            div.classList.add('kpi-active');

            kpiTreeConfig.focusKpiId = thisDiv.dataset.id;
        }
    }

    kpiChangeListener(event) {
        console.log('EDIT=' + event);

        const thisDiv = event.target;

        if (thisDiv.dataset.id != null) {

        }
    }

    kpiClickListener(event, self) {
        const thisDiv = event.target;

        if (thisDiv.dataset.id != null) {
            if (kpiTreeConfig.selectKpiId != null && thisDiv.dataset.id != kpiTreeConfig.selectKpiId) {
                highlightResetKpiByUid(kpiTreeConfig.selectKpiId);
            }

            if (thisDiv.dataset.id !== kpiTreeConfig.selectKpiId) {
                kpiTreeConfig.selectKpiId = thisDiv.dataset.id;
                self.selectedKpiChanges = { ...self.getSelectedKpi() };

               highlightKpiByUid(kpiTreeConfig.selectKpiId);
            }
        }
    }

    onKpiTitleChange($event) {
        this.selectedKpiChanges.title = $event.currentTarget.value;
    }

    onKpiStatusChange($event) {
        this.selectedKpiChanges.style = `alert alert-${$event.currentTarget.value}`;
    }

    onKpiSymbolChange($event) {
        this.selectedKpiChanges.symbol = $event.currentTarget.value;
    }

    onSave() {
        const kpi = this.getSelectedKpi();

        kpi.title = this.selectedKpiChanges.title;
        kpi.symbol = this.selectedKpiChanges.symbol;
        kpi.style = this.selectedKpiChanges.style;

        this.drawTree();

        this.kpiService.saveKpi(this.selectedKpiChanges, kpiTreeConfig.kpiTree.uid);
    }
}
