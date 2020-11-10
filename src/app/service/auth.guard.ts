import {Injectable, NgZone} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router, private ngZone: NgZone) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.auth.isLogged()) {
            return true;
        } else {
            return false;
        }
    }

}
