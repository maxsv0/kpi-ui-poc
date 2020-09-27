
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

export function getRandomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function highlightKpi(element: HTMLElement) {
    element.classList.remove('alert-primary');
    element.classList.add('alert-warning');
}

function highlightKpiReset(element: HTMLElement) {
    element.classList.remove('alert-warning');
    element.classList.add('alert-primary');
}
