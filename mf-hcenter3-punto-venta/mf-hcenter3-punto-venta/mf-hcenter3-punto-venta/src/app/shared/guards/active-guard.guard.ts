import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { TokenStorageService } from "../services/token-storage.service";


@Injectable({
    providedIn: 'root'
})
export class ActiveGuardGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private tokenStorage:TokenStorageService) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.authService.isAuthenticated()) {
            if (this.isTokekenExpirado()) {
                this.authService.signOut();
                this.tokenStorage.closeSessionView();
                this.router.navigateByUrl('/login',{skipLocationChange:true});
                return false;
            }
            if(!["/login", "/home"].some(x=>x == state.url) ){
              return this.tokenStorage.routesAngular.some(x=>state.url.includes(x));
            }
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }

    isTokekenExpirado(): boolean {
        let token = this.authService.token;
        let payload = this.authService.obtenerDatosToken(token);
        // obtengo fecha actual en segundos
        let now = new Date().getTime() / 1000;
        if (payload.exp < now) {// expiró
            return true;
        }
        return false;
    }
}

