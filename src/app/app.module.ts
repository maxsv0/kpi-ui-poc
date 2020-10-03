import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {HttpClientModule} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {KpiTreeComponent} from './kpi-tree/kpi-tree.component';
import {KpiTreePreviewComponent} from './kpi-tree-preview/kpi-tree-preview.component';
import {AuthService} from "./service/auth.service";
import { KpiTreesComponent } from './kpi-trees/kpi-trees.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        KpiTreeComponent,
        HomeComponent,
        KpiTreePreviewComponent,
        KpiTreesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
