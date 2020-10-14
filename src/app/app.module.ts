import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {IndexComponent} from './index/index.component';
import {HomeComponent} from './home/home.component';
import {KpiTreeComponent} from './kpi-tree/kpi-tree.component';
import {KpiTreePreviewComponent} from './kpi-tree-preview/kpi-tree-preview.component';
import {KpiTreesComponent} from './kpi-trees/kpi-trees.component';
import {AuthService} from "./service/auth.service";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

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
        HttpClientModule,
        BrowserAnimationsModule,
        BsDropdownModule.forRoot()
    ],
    providers: [AuthService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
