import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
	providedIn: 'root',
})
export class LoginGuard {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate():
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		if (this.auth.isLoggedIn) {
			// determine if the user is logged in from this method.
			return true;
		}
		return false;
	}

	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.auth.isLoggedIn) {
			// determine if the user is logged in from this method.
			return false;
		}
		return true;
	}
}
