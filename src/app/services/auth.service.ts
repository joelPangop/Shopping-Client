import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../models/environements';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AlertController, Platform} from '@ionic/angular';
import {Utilisateur} from '../models/utilisateur-interface';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Address} from '../models/address-interface';
import {UserInfo} from '../models/userInfo-interface';
import {RoleType} from '../models/roleType';

const TOKEN_KEY = 'access_token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    url = environment.api_url;
    user = {} as Utilisateur;
    authenticationState = new BehaviorSubject(false);
    currentUser: Utilisateur;
    isPasswordForgotten = false;
    address = {} as Address;
    userInfo = {} as UserInfo;

    constructor(private http: HttpClient, public helper: JwtHelperService, public storage: NativeStorage,
                private plt: Platform, private alertController: AlertController) {
        this.currentUser = {} as Utilisateur;
        this.plt.ready().then(() => {
            this.checkToken();
        });
    }

    checkToken() {
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
    }

    register(credentials) {
        return this.http.post(`${this.url}/api/register`, credentials).pipe(
            catchError(e => {
                this.showAlert(e.error.msg);
                throw new Error(e);
            })
        );
    }

    login(credentials):Observable<any>{
        // const xhr = new XMLHttpRequest();
        // const stor = this.storage;
        // const auth = this.authenticationState;
        // xhr.open('POST', `${environment.api_url}/login`, true);
        // xhr.responseType = 'json';
        // // Website you wish to allow to connect
        // xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
        // xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8101');
        // xhr.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8102');
        //
        // // Request methods you wish to allow
        // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        //
        // // Request headers you wish to allow
        // xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // // Set to true if you need the website to include cookies in the requests sent
        // // to the API (e.g. in case you use sessions)
        // xhr.setRequestHeader('Access-Control-Allow-Credentials', String(true));
        //
        // // Send the proper header information along with the request
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        //
        // xhr.send('email=' + credentials.email + '&password=' + credentials.password);
        // try {
        //     // tslint:disable-next-line:only-arrow-functions
        //     xhr.onload = async () => {
        //         if (xhr.readyState === 4 && xhr.status === 200) {
        //             // alert(xhr.response);
        //             await this.storage.setItem(TOKEN_KEY, xhr.response.access_token);
        //
        //             this.user = this.helper.decodeToken(xhr.response.access_token);
        //             this.currentUser = xhr.response.user[0];
        //             await this.storage.setItem('Utilisateur', xhr.response.user[0]).then(async data => {
        //                 await this.storage.setItem('IsLogginIn', true);
        //
        //                 this.authenticationState.next(true);
        //             });
        //         }
        //         console.log(xhr.response.user);
        //
        //         return xhr.response;
        //     };
        // } catch (e) {
        //     this.showAlert('Incorrect username or/and password');
        //     this.isPasswordForgotten = true;
        //     throw new Error(e);
        // }
        return this.http.post<any>(`${environment.api_url}/login`, credentials)
        .pipe(
            tap(async res => {
                // this.storage.set(TOKEN_KEY, res.token);
                // this.user = this.helper.decodeToken(res.token);
                await this.storage.setItem(TOKEN_KEY, res['access_token']);
                this.user = this.helper.decodeToken(res['access_token']);
                this.currentUser = res.user[0];
                await this.storage.setItem('Utilisateur', res.user[0]);
                await this.storage.setItem('IsLogginIn', true);
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
        return this.http.put(this.url + '/user', utilisateur);
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

        this.storage.remove('page').then(() => {
            console.log('route page removed');
        });

        this.storage.remove('user').then(() => {
            console.log('user removed');
        });
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

    isAuthenticated() {
        return this.authenticationState.value;
    }

    showAlert(msg) {
        const alert = this.alertController.create({
            message: msg,
            header: 'Error',
            buttons: ['OK']
        });
        +
            alert.then(alt => alt.present());
    }

    getUserById(id): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${environment.api_url}/Utilisateur/${id}`);
    }

    isAdmin() {
        return this.currentUser.role == RoleType.ADMIN;
    }
}
