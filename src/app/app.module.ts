import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './index/index.component';
import {HttpClientModule} from '@angular/common/http';
import {KpiTreeComponent} from './kpi-tree/kpi-tree.component';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        KpiTreeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
