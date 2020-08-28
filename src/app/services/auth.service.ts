import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../models/environements';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertController, Platform} from '@ionic/angular';
import {Currency, Utilisateur} from '../models/utilisateur-interface';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Address} from '../models/address-interface';
import {UserInfo} from '../models/userInfo-interface';
import {RoleType} from '../models/roleType';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AuthResponse} from '../models/auth-response';
import {StorageService} from './storage.service';
import {UserStorageUtils} from './UserStorageUtils';

const TOKEN_KEY = 'access_token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    url = 'http://192.168.2.58:4000';
    user = {} as Utilisateur;
    authenticationState = new BehaviorSubject(false);
    currentUser: Utilisateur;
    isPasswordForgotten = false;
    address = {} as Address;
    userInfo = {} as UserInfo;
    local;
    currency: any = {};
    currencyIcon;

    constructor(private http: HttpClient, public helper: JwtHelperService, private router: Router, private userStorageUtils: UserStorageUtils,
                private plt: Platform, private alertController: AlertController, public localStorage: Storage, private storageService: StorageService) {
        this.currentUser = {} as Utilisateur;
        this.plt.ready().then(() => {
            this.checkToken();
        });
        this.userStorageUtils.getUser().then(rep => {
            this.currentUser = rep;
        });

        this.storageService.getObject('currency').then((res: any) => {
            if (res) {
                this.currency = res.currency;
            } else {
                if (this.currentUser) {
                    if(this.currentUser.currency){
                        this.currency = this.currentUser.currency;
                    } else {
                        this.currency = {currency: 'CAD', icon: 'flag-for-flag-canada'};
                    }
                } else {
                    this.currency = {currency: 'CAD', icon: 'flag-for-flag-canada'};
                }
            }
        });

        this.userStorageUtils.getCurrency().then(res => {
            let curren: Currency = res;
            if (curren) {
                this.currency = curren.currency;
                this.currencyIcon = curren.icon;
            } else {
                if (this.currentUser._id) {
                    this.currency = this.currentUser.currency.currency;
                    this.currencyIcon = this.currentUser.currency.icon;
                }
            }
        });

    }

    checkToken() {
        if (this.plt.is('android') || this.plt.is('ios')) {
            this.localStorage.get(TOKEN_KEY).then(token => {
                if (token) {
                    const decoded = this.helper.decodeToken(token);
                    const isExpired = this.helper.isTokenExpired(token);

                    if (!isExpired) {
                        this.user = decoded;
                        this.authenticationState.next(true);
                    } else {
                        this.localStorage.remove(TOKEN_KEY);
                    }
                }
            });
        } else {
            this.localStorage.get(TOKEN_KEY).then(token => {
                if (token) {
                    const decoded = this.helper.decodeToken(token);
                    const isExpired = this.helper.isTokenExpired(token);

                    if (!isExpired) {
                        this.user = decoded;
                        this.authenticationState.next(true);
                    } else {
                        this.localStorage.remove(TOKEN_KEY);
                    }
                }
            });
        }
    }

    register(credentials): Observable<AuthResponse> {
        return this.http.post(`${environment.api_url}/api/register`, credentials).pipe(
            tap(async (res: AuthResponse) => {
                this.user = this.helper.decodeToken(res['access_token']);
                this.currentUser = res.user[0];
                this.currency = this.currentUser.currency;
            }),
            catchError(e => {
                this.showAlert(e.error.msg);
                throw new Error(e);
            })
        );
    }

    login(credentials): Observable<AuthResponse> {
        console.log(this.plt.platforms());
        return this.http.post<any>(`${environment.api_url}/login`, credentials)
            .pipe(
                tap(async (res: AuthResponse) => {
                    await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    this.user = this.helper.decodeToken(res['access_token']);
                    this.currentUser = res.user[0];
                    await this.storageService.setObject('Utilisateur', res.user[0]);
                    await this.storageService.setObject('IsLogginIn', true);
                    this.currency = this.currentUser.currency;
                    this.authenticationState.next(true);

                }),
                catchError(e => {
                    this.showAlert('incorrect username or/and password');
                    this.isPasswordForgotten = true;
                    throw new Error(e);
                })
            );
    }

    updateProfile(utilisateur) {
        return this.http.put<any>(`${environment.api_url}/user`, utilisateur)
            .pipe(
                tap(async res => {
                    // if (this.plt.is('android') || this.plt.is('ios')) {
                    await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    // await this.localStorage.set(TOKEN_KEY, res['access_token']);
                    this.user = this.helper.decodeToken(res['access_token']);
                    this.currentUser = res.user[0];
                    await this.storageService.setObject('Utilisateur', res.user[0]);
                    await this.storageService.setObject('IsLogginIn', true);
                    this.currency = this.currentUser.currency;
                    this.authenticationState.next(true);
                }),
                catchError(e => {
                    this.showAlert('incorrect username or/and password');
                    this.isPasswordForgotten = true;
                    throw new Error(e);
                })
            );
    }

    //
    // changePassword(user: User) {
    //   return this.http.post(`${this.url}/change-password`, user)
    //       .pipe(
    //           tap(res => {
    //             this.storage.set(TOKEN_KEY, res.token);
    //             this.user = this.helper.decodeToken(res.token);
    //             this.storage.set('user', this.user);
    //             this.authenticationState.next(true);
    //           }),
    //           catchError(e => {
    //             this.showAlert('');
    //             throw new Error(e);
    //           })
    //       );
    // }

    logout(): boolean {

        let rep: boolean = false;

        this.storageService.removeItem(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('page').then(() => {
            console.log('route page removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('Utilisateur').then(() => {
            console.log('user removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('IsLogginIn').then(() => {
            console.log('logged out');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('cart').then(() => {
            console.log('cart removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('currency').then(() => {
            console.log('currency removed');
            this.currentUser = {
                username: 'guest',
                type: 'guest',
                currency: {currency: 'CAD', icon: 'flag-for-flag-canada'}
            };
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('__paypal_storage__').then(() => {
            console.log('paypal_storage removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        this.storageService.removeItem('SELECTED_LANGUAGE').then(() => {
            console.log('SELECTED_LANGUAGE removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });
        this.currentUser = {} as Utilisateur;
        return rep;
    }

    getSpecialData() {
        return this.http.get(`${this.url}/api/special`).pipe(
            catchError(e => {
                const status = e.status;
                if (status === 401) {
                    this.showAlert('You are not authorized for this!');
                    this.logout();
                }
                throw new Error(e);
            })
        );
    }

    // isAuthenticated(): Observable<boolean>{
    //     return this.authenticationState.asObservable();
    // }

    public isAuthenticated: Observable<boolean> = this.authenticationState.asObservable();

    showAlert(msg) {
        const alert = this.alertController.create({
            message: msg,
            header: 'Error',
            buttons: ['OK']
        });
        alert.then(alt => alt.present());
    }

    getUserById(id): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${environment.api_url}/Utilisateur/${id}`);
    }

    isAdmin() {
        return this.currentUser.role == RoleType.ADMIN;
    }

    public async setCurrency(value: any) {
        this.currency = value;
        await this.storageService.setObject('currency', {
            currency: value
        });
    }

    getCurrency(): any {
        return this.currency;
    }

}
