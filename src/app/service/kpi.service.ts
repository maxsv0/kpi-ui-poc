import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

    getMyKpiTreesList() {
        return this.http.get<KpiListResponse>(`${this.baseUrl}/kpiTrees-my?userId=${this.authService.getCurrentUser().uid}`);
    }

    saveKpi(kpi: Kpi) {
        return this.http.get<KpiListResponse>(`${this.baseUrl}/kpiTrees`);
    }
}
