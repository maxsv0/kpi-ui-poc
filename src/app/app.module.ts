import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {IndexComponent} from './index/index.component';
import {MyTreesComponent} from './my-trees/my-trees.component';
import {KpiTreeComponent} from './kpi-tree/kpi-tree.component';
import {KpiTreePreviewComponent} from './kpi-tree-preview/kpi-tree-preview.component';
import {AuthService} from "./service/auth.service";
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MyTreeComponent } from './my-tree/my-tree.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        KpiTreeComponent,
        MyTreesComponent,
        KpiTreePreviewComponent,
        MyTreeComponent
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
