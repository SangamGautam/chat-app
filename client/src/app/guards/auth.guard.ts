import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // Check if route is restricted by role
            const userRoles = currentUser.roles || [];
            const requiredRoles = route.data['roles'] || [];

            if (!userRoles.some((role: string) => requiredRoles.includes(role))) {

                // Role not authorized, redirect to home page
                this.router.navigate(['/']);
                return false;
            }

            // Authorized, return true
            return true;
        }

        // Not logged in, redirect to login page with the return URL
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
