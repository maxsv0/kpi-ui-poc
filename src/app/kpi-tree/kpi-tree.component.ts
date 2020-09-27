import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {KpiRecursive} from "../model/kpi-recursive";
import {highlightPathToRoot, highlightResetPathToRoot} from "../kpi-tree-tools";
import {KpiService} from "../service/kpi.service";
import {KpiTree} from "../model/kpi-tree";

declare let LeaderLine: any;

@Component({
  selector: 'app-kpi-tree',
  templateUrl: './kpi-tree.component.html',
  styleUrls: ['./kpi-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KpiTreeComponent implements OnInit {
  kpiTree: KpiTree;
  lines = [];
  offset = 75;

  @Input()
  treeId: string;

  constructor(private kpiService: KpiService) {

  }

  ngOnInit() {
      this.kpiService.getKpiTree(this.treeId)
          .subscribe(response => {
            this.kpiTree = response.kpiTree;

              console.log(this.kpiTree);

              const nest = (items, uid = null, link = 'parentId') =>
                  items
                      .filter(item => item[link] === uid)
                      .map(item => ({...item, children: nest(items, item.uid)}));

              const myTree = nest(this.kpiTree.kpi);

              console.log(myTree);

              this.drawTree(myTree);
          });
  }

  drawTree(tree: KpiRecursive[]) {
    this.drawTreeLeaf(tree[0], tree[0], 0, 700);
  }

  drawTreeLeaf(leaf: KpiRecursive, root: KpiRecursive, index: number, topOffset: number) {
    console.log(index, leaf.uid);
    this.drawTreeLeafKpi(leaf, root, index, topOffset + leaf.offsetTop);

    if (leaf.children != null) {
      let topOffsetNew = topOffset - ((leaf.children.length - 1) * this.offset / 2);

      leaf.children.sort((a, b) => {
        return a.orderId - b.orderId;
      });

      for (const item of leaf.children) {
        this.drawTreeLeaf(item, root, index + 1, topOffsetNew + leaf.offsetTop);
        topOffsetNew += this.offset;

        this.lines[item.uid] = new LeaderLine(
            document.getElementById('kpi-' + leaf.uid),
            document.getElementById('kpi-' + item.uid),
            {color: '#639dd7', size: 2}
        );
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

    div.addEventListener('mouseover', this.kpiClickListener);

    tree.appendChild(div);
  }

  kpiClickListener(event) {
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
}
