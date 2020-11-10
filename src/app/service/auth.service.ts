import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    auth;

    constructor(
        public router: Router,
        public ngZone: NgZone
    ) {

        this.auth = (window as any).firebase.auth;

        this.auth().onAuthStateChanged((user) => {
            if (user) {
                this.ngZone.run(() => {
                    console.log('user signed in');
                });
            }
        });
    }

    async signinWithGoogle() {
        const provider = new this.auth.GoogleAuthProvider();

        try {
            await this.auth().setPersistence(this.auth.Auth.Persistence.LOCAL)
            await this.auth().signInWithPopup(provider)
            this.ngZone.run(() => {
                this.router.navigate(['/my-trees']);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async signOut() {
        try {
            await this.auth().signOut();
            this.router.navigate(['']);
        } catch (error) {
            console.error(error);
        }
    }

    isLogged() {
        return !!this.getCurrentUser();
    }

    getCurrentUser() {
        return this.auth().currentUser;
    }

    getAccessToken() {
        // promise
        return this.getCurrentUser().getIdToken();
    }
}