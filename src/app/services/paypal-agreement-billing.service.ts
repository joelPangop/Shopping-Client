import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalAgreementBillingService implements CanActivate{

  constructor(private activatedRoute: ActivatedRoute) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const queryParams = this.activatedRoute.snapshot.queryParams as {};
    if (Object.keys(queryParams).length !== 0 && queryParams.constructor === Object) {
      return new Promise<boolean>(resolve => true);
    }
    return new Promise<boolean>(resolve => false);
  }
}
