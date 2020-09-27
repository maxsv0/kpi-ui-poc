import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {KpiResponse} from "../model/kpi-response";

@Injectable({
    providedIn: 'root'
})
export class KpiService {

    constructor(private http: HttpClient) {
    }

    getData(treeId: string) {
        return this.http.get<KpiResponse>('https://kpiapi.msvhost.com/kpiTree?treeId=' + treeId);
    }
}
