import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {HomeComponent} from "./home/home.component";
import {KpiTreeComponent} from "./kpi-tree/kpi-tree.component";
import {KpiTreesComponent} from "./kpi-trees/kpi-trees.component";
import {AuthGuard} from "./service/auth.guard";

const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'trees', component: KpiTreesComponent},
    {path: 'kpi-tree/:treeID', component: KpiTreeComponent},
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
