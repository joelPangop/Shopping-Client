import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../models/environements';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
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
import {DeviceInfo, Plugins} from '@capacitor/core';
import {Device} from '../models/device-interface';
import {AngularFireAuth} from '@angular/fire/auth';
import {SMS} from '@ionic-native/sms/ngx';
import {MessageService} from './message.service';
import {Mail} from '../models/mail-interface';
import {Utils} from '../Utils';

const TOKEN_KEY = 'access_token';
const {CapacitorVideoPlayer, Device} = Plugins;

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
    confirmation_code: string;

    constructor(private http: HttpClient, public helper: JwtHelperService, private router: Router, private userStorageUtils: UserStorageUtils,
                private plt: Platform, private alertController: AlertController, public localStorage: Storage,
                private storageService: StorageService, private messageService: MessageService) {
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
                    if (this.currentUser.currency) {
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
        return this.http.post<any>(`${environment.api_url}/api/register`, credentials).pipe(
            tap(async (res) => {
                // this.user = this.helper.decodeToken(res['user']);
                this.user = res;
                // this.currentUser = res.user;
                // this.currency = this.currentUser.currency;
                this.confirmation_code = Utils.makeString(10);
                let body = 'The confirmation code is ' + this.confirmation_code;
                const content: Mail = {
                    to: res.email,
                    subject: 'Registration confirmation',
                    text: body
                };

                if (res) {
                    this.messageService.sendMail(content).subscribe(res1 => {
                        console.log(res1);
                    });
                }
            }),
            catchError(e => {
                this.showAlert(e.error.msg);
                throw new Error(e);
            })
        );
    }

    verification_user(utilisateur): Observable<any> {
        return this.http.put<any>(`${environment.api_url}/update_verification`, utilisateur)
            .pipe(
                tap(async res => {
                    console.log('res', res);
                    // if (this.plt.is('android') || this.plt.is('ios')) {
                    // await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    // // await this.localStorage.set(TOKEN_KEY, res['access_token']);
                    // this.user = this.helper.decodeToken(res['access_token']);
                    // this.currentUser = res.user;
                    // await this.storageService.setObject('Utilisateur', res.user);
                    // await this.storageService.setObject('IsLogginIn', true);
                    // this.currency = this.currentUser.currency;
                    // this.authenticationState.next(true);
                }),
                catchError(e => {
                    this.showAlert('incorrect username or/and password');
                    this.isPasswordForgotten = true;
                    throw new Error(e);
                })
            );
    }

    login(credentials): Observable<any> {
        console.log(this.plt.platforms());
        return this.http.post<any>(`${environment.api_url}/login`, credentials)
            .pipe(
                tap(async (res) => {
                    await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    this.user = this.helper.decodeToken(res['access_token']);
                    this.currentUser = res.user;
                    await this.storageService.setObject('Utilisateur', res.user);
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

    updateProfile(utilisateur): Observable<AuthResponse> {
        return this.http.put<any>(`${environment.api_url}/user`, utilisateur)
            .pipe(
                tap(async res => {
                    // if (this.plt.is('android') || this.plt.is('ios')) {
                    await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    // await this.localStorage.set(TOKEN_KEY, res['access_token']);
                    this.user = this.helper.decodeToken(res['access_token']);
                    this.currentUser = res.user;
                    await this.storageService.setObject('Utilisateur', res.user);
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

    updateProfilePassword(utilisateur): Observable<AuthResponse> {
        return this.http.put<any>(`${environment.api_url}/user/password`, utilisateur)
            .pipe(
                tap(async res => {
                    // if (this.plt.is('android') || this.plt.is('ios')) {
                    await this.storageService.setObject(TOKEN_KEY, res['access_token']);
                    // await this.localStorage.set(TOKEN_KEY, res['access_token']);
                    this.user = this.helper.decodeToken(res['access_token']);
                    await this.storageService.setObject('Utilisateur', res.user);
                    await this.storageService.setObject('IsLogginIn', true);
                    this.currency = res.user.currency;
                    this.currentUser = res.user;
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

    // @ts-ignore
    getUserName(token: any): Observable<any> {
        const url = `${environment.api_url}/user/username/${token}`;
        return this.http.get<any>(url);
    }

    async logout(): Promise<boolean> {

        let rep: boolean = false;

        await this.storageService.removeItem(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('page').then(() => {
            console.log('route page removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('Utilisateur').then(() => {
            console.log('user removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('IsLogginIn').then(() => {
            console.log('logged out');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('cart').then(() => {
            console.log('cart removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('currency').then(() => {
            console.log('currency removed');
            // const device: Device = Device.getInfo();
            this.currentUser = {
                username: 'guest',
                type: 'guest',
                currency: {currency: 'CAD', icon: 'flag-for-flag-canada'},
                // userInfo: {
                //     devices:[device]
                // }
            };
            this.currency.currency = 'CAD';
            this.currency.icon = 'flag-for-flag-canada';
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('__paypal_storage__').then(() => {
            console.log('paypal_storage removed');
            rep = true;
        }).catch((err) => {
            console.log('error', err);
            rep = false;
        });

        await this.storageService.removeItem('SELECTED_LANGUAGE').then(() => {
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

    getUserByEmail(email: string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${environment.api_url}/user/${email}`);
    }
}
