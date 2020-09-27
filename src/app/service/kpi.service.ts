import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KpiResponse} from "../model/kpi-response";
import {KpiListResponse} from "../model/kpi-list-response";

@Injectable({
    providedIn: 'root'
})
export class KpiService {

    constructor(private http: HttpClient) {
    }

    getKpiTree(treeId: string) {
        return this.http.get<KpiResponse>('https://kpiapi.msvhost.com/kpiTree?treeId=' + treeId);
    }

    getKpiTreesList() {
        return this.http.get<KpiListResponse>('https://kpiapi.msvhost.com/kpiTrees');
    }
}
