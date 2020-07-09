import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../models/environements';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertController, Platform} from '@ionic/angular';
import {Utilisateur} from '../models/utilisateur-interface';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Address} from '../models/address-interface';
import {UserInfo} from '../models/userInfo-interface';
import {RoleType} from '../models/roleType';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {AuthResponse} from '../models/auth-response';

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

    constructor(private http: HttpClient, public helper: JwtHelperService, public storage: NativeStorage, private router: Router,
                private plt: Platform, private alertController: AlertController, public localStorage: Storage) {
        this.currentUser = {} as Utilisateur;
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }

    checkToken() {
        if (this.plt.is('android') || this.plt.is('ios')) {
            this.storage.getItem(TOKEN_KEY).then(token => {
                if (token) {
                    const decoded = this.helper.decodeToken(token);
                    const isExpired = this.helper.isTokenExpired(token);

                    if (!isExpired) {
                        this.user = decoded;
                        this.authenticationState.next(true);
                    } else {
                        this.storage.remove(TOKEN_KEY);
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
                        this.storage.remove(TOKEN_KEY);
                    }
                }
            });
        }
    }

    register(credentials) : Observable<AuthResponse>{
        return this.http.post(`${environment.api_url}/api/register`, credentials).pipe(
            tap(async (res: AuthResponse) => {
                this.user = this.helper.decodeToken(res['access_token']);
                this.currentUser = res.user[0];
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
                    if (this.plt.is('android') || this.plt.is('ios')) {
                        await this.storage.setItem(TOKEN_KEY, res['access_token']);
                        this.user = this.helper.decodeToken(res['access_token']);
                        this.currentUser = res.user[0];
                        await this.storage.setItem('Utilisateur', res.user[0]);
                        await this.storage.setItem('IsLogginIn', true);
                    } else if (!this.plt.is('android') && !this.plt.is('ios')) {
                        await this.localStorage.set(TOKEN_KEY, res['access_token']);
                        this.user = this.helper.decodeToken(res['access_token']);
                        this.currentUser = res.user[0];
                        await this.localStorage.set('Utilisateur', res.user[0]);
                        await this.localStorage.set('IsLogginIn', true);
                    }
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
                    if (this.plt.is('android') || this.plt.is('ios')) {
                        await this.storage.setItem(TOKEN_KEY, res['access_token']);
                        // await this.localStorage.set(TOKEN_KEY, res['access_token']);
                        this.user = this.helper.decodeToken(res['access_token']);
                        this.currentUser = res.user[0];
                        await this.storage.setItem('Utilisateur', res.user[0]);
                        await this.storage.setItem('IsLogginIn', true);
                    } else if (!this.plt.is('android') && !this.plt.is('ios')) {
                        await this.localStorage.set(TOKEN_KEY, res['access_token']);
                        this.user = this.helper.decodeToken(res['access_token']);
                        this.currentUser = res.user[0];
                        await this.localStorage.set('Utilisateur', res.user[0]);
                        await this.localStorage.set('IsLogginIn', true);
                    }
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

    logout() {
        this.storage.remove(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
        });

        this.localStorage.remove(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
        });

        this.storage.remove('page').then(() => {
            console.log('route page removed');
        });

        this.localStorage.remove('page').then(() => {
            console.log('route page removed');
        });

        this.storage.remove('Utilisateur').then(() => {
            console.log('user removed');
        });

        this.localStorage.remove('Utilisateur').then(() => {
            console.log('user removed');
        });

        this.storage.remove('IsLogginIn').then(() => {
            console.log('logged out');
        });

        this.localStorage.remove('IsLogginIn').then(() => {
            console.log('logged out');
        });

        this.storage.remove('cart').then(() => {
            console.log('cart removed');
        });

        this.localStorage.remove('cart').then(() => {
            console.log('cart removed');
        });

        this.storage.remove('currency').then(() => {
            console.log('currency removed');
        });

        this.localStorage.remove('currency').then(() => {
            console.log('currency removed');
        });

        this.storage.remove('__paypal_storage__').then(() => {
            console.log('paypal_storage removed');
        });

        this.localStorage.remove('__paypal_storage__').then(() => {
            console.log('paypal_storage removed');
        });

        this.storage.remove('SELECTED_LANGUAGE').then(() => {
            console.log('SELECTED_LANGUAGE removed');
        });

        this.localStorage.remove('SELECTED_LANGUAGE').then(() => {
            console.log('SELECTED_LANGUAGE removed');
        });
        this.router.navigate(['/onbroading']);

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
}
