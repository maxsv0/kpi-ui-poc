import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {KpiRecursive} from "../model/kpi-recursive";
import {getRandomUUID, highlightPathToRoot, highlightResetPathToRoot} from "../kpi-tree-tools";
import {KpiService} from "../service/kpi.service";
import {KpiTree} from "../model/kpi-tree";
import {Kpi} from "../model/kpi";

declare let LeaderLine: any;

@Component({
    selector: 'app-kpi-tree',
    templateUrl: './kpi-tree.component.html',
    styleUrls: ['./kpi-tree.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KpiTreeComponent implements OnInit {
    kpiTree: KpiTree;
    kpiTreeRecursive: KpiRecursive[];
    lines = [];
    offset = 75;
    offsetTop = 700;
    maxDepth = -1;

    @Input()
    treeId: string;

    constructor(private kpiService: KpiService) {

    }

    ngOnInit() {
        this.kpiService.getKpiTree(this.treeId)
            .subscribe(response => {
                this.kpiTree = response.kpiTree;

                this.initKpiTreeRecursive();
            });
    }

    addKpi() {
        const kpiClick = document.getElementById('kpi-click');

        this.addKpiChildren(kpiClick.innerText);

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

        this.kpiTreeRecursive = nest(this.kpiTree.kpi);
        this.maxDepth = parseInt((document.getElementById('maxDepth') as HTMLInputElement).value);

        this.removeKpiTree();

        this.drawTree(this.kpiTreeRecursive, this.maxDepth);
    }

    addKpiChildren(parentUid: string) {
        let child1 = new Kpi();
        child1.orderId = 1;
        child1.title = 'Next Level KPI 1';
        child1.parentId = parentUid;
        child1.style = 'alert alert-primary';
        child1.uid = getRandomUUID();

        let child2 = new Kpi();
        child2.orderId = 2;
        child2.title = 'Next Level KPI 2';
        child2.parentId = parentUid;
        child2.style = 'alert alert-primary';
        child2.uid = getRandomUUID();

        this.kpiTree.kpi.push(child1, child2);
    }

    drawTree(tree: KpiRecursive[], maxDepth: number) {
        console.log(this.kpiTreeRecursive);

        this.drawTreeLeaf(tree[0], tree[0], 0, maxDepth, this.offsetTop);
    }

    drawTreeLeaf(leaf: KpiRecursive, root: KpiRecursive, depth: number, maxDepth: number, topOffset: number) {

        console.log(depth, leaf.uid, leaf.title);
        this.drawTreeLeafKpi(leaf, root, depth, topOffset + leaf.offsetTop);

        if (maxDepth != -1 && depth > maxDepth) return;

        if (leaf.children != null) {
            let topOffsetNew = topOffset - ((leaf.children.length - 1) * this.offset / 2);

            leaf.children.sort((a, b) => {
                return a.orderId - b.orderId;
            });

            for (const item of leaf.children) {
                this.drawTreeLeaf(item, root, depth + 1, maxDepth,topOffsetNew + leaf.offsetTop);
                topOffsetNew += this.offset;

                this.lines.push(new LeaderLine(
                    document.getElementById('kpi-' + leaf.uid),
                    document.getElementById('kpi-' + item.uid),
                    {color: '#639dd7', size: 2}
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
        div.style.left = 50 + 250 * index + 'px';
        div.setAttribute('data-id', leaf.uid);
        div.setAttribute('data-parent-id', leaf.parentId);

        div.addEventListener('mouseover', this.kpiMouseOverListener);
        div.addEventListener('click', this.kpiClickListener);

        tree.appendChild(div);
    }

    kpiMouseOverListener(event) {
        const thisDiv = event.target;

        const tree = document.getElementById('kpitree');
        if (tree.dataset.activeId != null) {
            const divActive = document.getElementById(tree.dataset.activeId);
            highlightResetPathToRoot(divActive);

            divActive.classList.remove('kpi-active');
        }

        const div = document.getElementById(thisDiv.id);
        div.classList.add('kpi-active');

        highlightPathToRoot(div);

        tree.setAttribute('data-active-id', thisDiv.id);
    }

    kpiClickListener(event) {
        const thisDiv = event.target;

        const tree = document.getElementById('kpitree');
        if (tree.dataset.activeId != null) {
            const divActive = document.getElementById(tree.dataset.activeId);

            const kpiClick = document.getElementById('kpi-click');
            kpiClick.innerText = divActive.dataset.id;
        }
    }
}
