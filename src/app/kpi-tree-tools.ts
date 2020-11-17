import {KpiTree} from "./model/kpi-tree";
import {KpiRecursive} from "./model/kpi-recursive";

export class KpiTreeConfig {
    kpiTree: KpiTree;
    kpiTreeRecursive: KpiRecursive[];
    lines = [];
    focusKpiId: any;
    selectKpiId: any;
    kpiTreeIndex: any[] = [];
}

export function editEndListener(event) {
    const textarea = event.target;

    const div = document.getElementById('kpi-' + textarea.dataset.id);
    div.innerHTML = textarea.value;
    div.classList.add('kpi-edited')
}

export function editEnableByUid(uid: string) {

}

export function highlightKpiByUid(uid: string) {
    const div = document.getElementById('kpi-' + uid);

    highlightKpi(div);
}

export function highlightResetKpiByUid(uid: string) {
    const div = document.getElementById('kpi-' + uid);

    highlightKpiReset(div);
}

export function highlightPathToRootByUid(uid: string) {
    const div = document.getElementById('kpi-' + uid);

    highlightPathToRoot(div);
}

export function highlightResetPathToRootByUid(uid: string) {
    const divActive = document.getElementById('kpi-' + uid);
    if (divActive != null) {
        highlightResetPathToRoot(divActive);
    }
}

function highlightPathToRoot(element: HTMLElement) {
    if (element == null) return;

    highlightKpi(element);

    if (element.dataset.parentId != null) {
        const div = document.getElementById('kpi-' + element.dataset.parentId);

        if (div != null) {
            highlightPathToRoot(div);
        }
    }
}

function highlightResetPathToRoot(element: HTMLElement) {
    if (element == null) return;

    highlightKpiReset(element);

    if (element.dataset.parentId != null) {
        const div = document.getElementById('kpi-' + element.dataset.parentId);

        if (div != null) {
            highlightResetPathToRoot(div);
        }
    }
}

export function getRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function highlightKpi(element: HTMLElement) {
    element.classList.add('kpi-highlight');
}

function highlightKpiReset(element: HTMLElement) {
    element.classList.remove('kpi-highlight');
}
