import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {KpiResponse} from "../model/kpi-response";
import {Kpi} from "../model/kpi";
import {KpiListResponse} from "../model/kpi-list-response";
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class KpiService {

    private baseUrl: string = "https://kpiapi.msvhost.com";

    constructor(private http: HttpClient, private authService: AuthService) {
    }

    getKpiTree(treeId: string) {
        return this.http.get<KpiResponse>(`${this.baseUrl}/kpiTree?treeId=${treeId}`);
    }

    getNewKpiTree() {
        return this.http.get<KpiResponse>(`${this.baseUrl}/kpiTree/new?userId=${this.authService.getCurrentUser().uid}`);
    }

    getMyKpiTreesList() {
        return this.http.get<KpiListResponse>(`${this.baseUrl}/kpiTrees-my?userId=${this.authService.getCurrentUser().uid}`);
    }

    saveKpi(kpi: Kpi, kpiTreeId: string) {
        return this.http.post<KpiListResponse>(`${this.baseUrl}/kpi/update`, JSON.stringify({kpi, kpiTreeId}), {
            headers: {
                'Content-type': 'application/json'
            }
        }).subscribe(data => console.log(data));
    }

    removeKpi(kpi: Kpi, kpiTreeId: string) {
        return this.http.delete<KpiListResponse>(`${this.baseUrl}/delete/${kpiTreeId}/kpi/${kpi.uid}`).subscribe(data => {
            console.log(data);
        })
    }

    removeKpiTree(kpiTreeId: string) {
        return this.http.delete<KpiListResponse>(`${this.baseUrl}/delete/${kpiTreeId}`).subscribe(data => {
            console.log(data);
        })
    }
}
