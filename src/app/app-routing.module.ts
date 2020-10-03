import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./service/auth.guard";

const routes: Routes = [
    {path: '', component: IndexComponent},
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
