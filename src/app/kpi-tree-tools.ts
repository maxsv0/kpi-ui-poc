export function highlightPathToRoot(element: HTMLElement) {
    highlightKpi(element);

    if (element.dataset.parentId != null) {
        const div = document.getElementById('kpi-' + element.dataset.parentId);

        if (div != null) {
            highlightPathToRoot(div);
        }
    }
}

export function highlightResetPathToRoot(element: HTMLElement) {
    highlightKpiReset(element);

    if (element.dataset.parentId != null) {
        const div = document.getElementById('kpi-' + element.dataset.parentId);

        if (div != null) {
            highlightResetPathToRoot(div);
        }
    }
}

export function highlightKpi(element: HTMLElement) {
    element.classList.remove('alert-primary');
    element.classList.add('alert-warning');
}

export function highlightKpiReset(element: HTMLElement) {
    element.classList.remove('alert-warning');
    element.classList.add('alert-primary');
}
