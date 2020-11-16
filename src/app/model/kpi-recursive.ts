export class KpiRecursive {
    uid: string;
    parentId: string;
    orderId: number;
    title: string;
    style: string;
    symbol?: string;
    offsetTop: number;
    children: KpiRecursive[];
}
