import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {MyTreesComponent} from './my-trees/my-trees.component';
import {MyTreeComponent} from './my-tree/my-tree.component';
import {KpiTreeComponent} from "./kpi-tree/kpi-tree.component";
import {KpiTreesComponent} from "./kpi-trees/kpi-trees.component";

const routes: Routes = [
    {path: '', component: IndexComponent},
    {path: 'trees', component: KpiTreesComponent},
    {path: 'trees/:treeID', component: KpiTreeComponent},
    {path: 'my-trees', component: MyTreesComponent},
    {path: 'my-trees/:treeID', component: MyTreeComponent},

    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
