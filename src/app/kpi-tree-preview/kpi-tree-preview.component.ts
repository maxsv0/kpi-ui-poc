import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { KpiTree } from "../model/kpi-tree";
import { Kpi } from "../model/kpi";
import {
    getRandomUUID,
    highlightPathToRootByUid,
    highlightResetPathToRootByUid,
    KpiTreeConfig
} from "../kpi-tree-tools";
import { KpiRecursive } from "../model/kpi-recursive";
import { KpiService } from '../service/kpi.service';
import { KpiChanges } from '../model/kpi-changes';

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
    offsetLeft = 250;
    maxDepth = -1;

    @Input("kpiTree") kpiTree: KpiTree;
    @Input("isReadOnly") isReadOnly: boolean = false;
    @Input("hasNoTitle") hasNoTitle: boolean = false;
    @Input("isNew") isNew: boolean = false;

    public showTitle: boolean = false;
    public kpiTreeConfig: KpiTreeConfig = kpiTreeConfig;
    public selectedKpiChanges: KpiChanges = {};

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
        this.addKpiChildren(kpiTreeConfig.selectKpiId);

        this.removeKpiTree();

        this.initKpiTreeRecursive();
    }

    moveKpiSelected(offset: number) {
        for (const kpi of kpiTreeConfig.kpiTree.kpi) {
            if (kpi.uid === kpiTreeConfig.selectKpiId) {
                kpi.offsetTop += offset;
            }
        }

        this.removeKpiTree();

        this.initKpiTreeRecursive();
    }

    removeKpiSelected() {
        const newKpi = [];
        for (const kpi of kpiTreeConfig.kpiTree.kpi) {
            if (kpi.uid !== kpiTreeConfig.selectKpiId) {
                newKpi.push(kpi);
            }
        }
        kpiTreeConfig.kpiTree.kpi = newKpi;
        kpiTreeConfig.selectKpiId = '';

        this.removeKpiTree();

        this.initKpiTreeRecursive();
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

        // this.maxDepth = parseInt((document.getElementById('maxDepth') as HTMLInputElement).value);

        this.removeKpiTree();

        this.drawTree(kpiTreeConfig.kpiTreeRecursive, this.maxDepth);
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

    drawTree(tree: KpiRecursive[], maxDepth: number) {
        console.log(kpiTreeConfig.kpiTreeRecursive);

        this.drawTreeLeaf(tree[0], tree[0], 0, maxDepth, this.offsetTop);
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
                    { color: '#639dd7', size: 2, path: 'grid' }
                ));
            }
        }
    }

    drawTreeLeafKpi(leaf: KpiRecursive, root: KpiRecursive, index: number, topOffset: number, isReadOnly: boolean) {
        const tree = document.getElementById('kpitree');

        const div = document.createElement('div');
        div.className = 'kpi text-center ' + leaf.style;
        div.innerHTML = leaf.title;
        div.id = 'kpi-' + leaf.uid;
        div.style.top = topOffset + 'px';
        div.style.left = 50 + this.offsetLeft * index + 'px';
        div.setAttribute('data-id', leaf.uid);
        div.setAttribute('data-parent-id', leaf.parentId);
        div.setAttribute('data-is-read-only', String(this.isReadOnly));

        div.addEventListener('mouseover', ($event) => this.kpiMouseOverListener($event, isReadOnly));
        div.addEventListener('click', this.kpiClickListener);

        tree.appendChild(div);
    }

    kpiMouseOverListener(event, isReadOnly) {
        const thisDiv = event.target;

        if (kpiTreeConfig.focusKpiId != null) {
            const divActive = document.getElementById('kpi-' + kpiTreeConfig.focusKpiId);
            divActive.classList.remove('kpi-active');
        }

        if (thisDiv.dataset.id != null) {
            const div = document.getElementById('kpi-' + thisDiv.dataset.id);
            div.classList.add('kpi-active');

            kpiTreeConfig.focusKpiId = thisDiv.dataset.id;

            if (!isReadOnly) {

                const button = document.createElement('button');

                document.querySelectorAll('.edit-btn').forEach(node => node.remove())

                button.innerText = "Edit";
                button.type = "button";
                button.className = 'btn btn-info edit-btn'
                button.setAttribute('data-id', thisDiv.dataset.id);
                button.setAttribute('data-toggle', 'modal');
                button.setAttribute('data-target', '#modal');
                button.addEventListener('mouseover', (e) => e.stopImmediatePropagation());

                div.append(button);
            }
        }
    }

    kpiChangeListener(event) {
        console.log('EDIT=' + event);

        const thisDiv = event.target;

        if (thisDiv.dataset.id != null) {

        }
    }

    kpiClickListener(event) {
        const thisDiv = event.target;

        if (thisDiv.dataset.id != null) {
            if (kpiTreeConfig.selectKpiId != null) {
                highlightResetPathToRootByUid(kpiTreeConfig.selectKpiId);
            }

            if (thisDiv.dataset.id !== kpiTreeConfig.selectKpiId) {
                kpiTreeConfig.selectKpiId = thisDiv.dataset.id;
                console.log(kpiTreeConfig);

                highlightPathToRootByUid(kpiTreeConfig.selectKpiId);
            }
        }
    }

    getSelectedKpi() {
        return kpiTreeConfig.kpiTree.kpi.find(item => item.uid === kpiTreeConfig.selectKpiId);
    }

    onKpiTitleChange($event) {
        this.selectedKpiChanges.title = $event.currentTarget.value;
    }

    onKpiStatusChange($event) {
        this.selectedKpiChanges.status = $event.currentTarget.value;
    }

    onKpiSymbolChange($event) {
        this.selectedKpiChanges.symbol = $event.currentTarget.value;
    }

    onSave() {
        const kpi = this.getSelectedKpi();
        kpi.style = this.selectedKpiChanges.status;
        kpi.title = `${this.selectedKpiChanges.title || 'No Title'} (${this.selectedKpiChanges.symbol || '$'})`;
        const div = document.getElementById('kpi-' + kpiTreeConfig.selectKpiId);
        div.innerText = kpi.title;
        div.className = `kpi text-center alert alert-${kpi.style}`;
        // this.kpiService.saveKpi(this.selectedKpiChanges);
    }
}
