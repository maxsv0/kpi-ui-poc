import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {KpiTree} from "../model/kpi-tree";
import {Kpi} from "../model/kpi";
import {
    editEndListener,
    getRandomUUID,
    highlightPathToRootByUid,
    highlightResetPathToRootByUid,
    KpiTreeConfig
} from "../kpi-tree-tools";
import {KpiRecursive} from "../model/kpi-recursive";

declare let LeaderLine: any;

let kpiTreeConfig = new KpiTreeConfig();

@Component({
    selector: 'app-kpi-tree-preview',
    templateUrl: './kpi-tree-preview.component.html',
    styleUrls: ['./kpi-tree-preview.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KpiTreePreviewComponent implements OnInit {

    lines = [];
    offset = 75;
    offsetTop = 700;
    offsetLeft = 250;
    maxDepth = -1;

    @Input("kpiTree") kpiTree: KpiTree;

    constructor() {

    }

    ngOnInit() {
        console.log('input tree=' + this.kpiTree);

        kpiTreeConfig.kpiTree = this.kpiTree;

        this.initKpiTreeRecursive();

        //
        //
        // this.kpiService.getKpiTree(this.treeId)
        //     .subscribe(response => {
        //         this.kpiTree = response.kpiTree;
        //         kpiTreeConfig.kpiTree = this.kpiTree;
        //
        //         this.initKpiTreeRecursive();
        //     });
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
        treeDiv.innerHTML = '';

        for (const line of this.lines) {
            line.remove();
        }
        this.lines = [];
    }

    initKpiTreeRecursive() {
        const nest = (items, uid = null, link = 'parentId') =>
            items
                .filter(item => item[link] === uid)
                .map(item => ({...item, children: nest(items, item.uid)}));

        kpiTreeConfig.kpiTreeRecursive = nest(kpiTreeConfig.kpiTree.kpi);

        this.maxDepth = parseInt((document.getElementById('maxDepth') as HTMLInputElement).value);

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
        this.drawTreeLeafKpi(leaf, root, depth, topOffset + leaf.offsetTop);

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
                    {color: '#639dd7', size: 2, path: 'grid'}
                ));
            }
        }
    }

    drawTreeLeafKpi(leaf: KpiRecursive, root: KpiRecursive, index: number, topOffset: number) {
        const tree = document.getElementById('kpitree');

        const div = document.createElement('div');
        div.className = 'kpi text-center ' + leaf.style;
        div.innerHTML = leaf.title;
        div.id = 'kpi-' + leaf.uid;
        div.style.top = topOffset + 'px';
        div.style.left = 50 + this.offsetLeft * index + 'px';
        div.setAttribute('data-id', leaf.uid);
        div.setAttribute('data-parent-id', leaf.parentId);

        div.addEventListener('mouseover', this.kpiMouseOverListener);
        div.addEventListener('click', this.kpiClickListener);

        tree.appendChild(div);
    }

    kpiMouseOverListener(event) {
        const thisDiv = event.target;

        if (kpiTreeConfig.focusKpiId != null) {
            const divActive = document.getElementById('kpi-' + kpiTreeConfig.focusKpiId);
            divActive.classList.remove('kpi-active');
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

    kpiClickListener(event) {
        const thisDiv = event.target;

        if (thisDiv.dataset.id != null) {
            if (kpiTreeConfig.selectKpiId != null) {
                highlightResetPathToRootByUid(kpiTreeConfig.selectKpiId);
                //editDisableByUid(kpiTreeConfig.selectKpiId, null);
            }

            if (thisDiv.dataset.id !== kpiTreeConfig.selectKpiId) {
                kpiTreeConfig.selectKpiId = thisDiv.dataset.id;

                highlightPathToRootByUid(kpiTreeConfig.selectKpiId);

                const div = document.getElementById('kpi-' + kpiTreeConfig.selectKpiId);
                const content = div.innerText;
                div.innerHTML = '';

                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.setAttribute('data-id', thisDiv.dataset.id);
                textarea.addEventListener('change', editEndListener);

                div.append(textarea);
            }
        }
    }
}
