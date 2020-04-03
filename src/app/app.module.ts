// @ts-ignore
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {IonicRatingModule} from 'ionic4-rating';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {File} from '@ionic-native/file/ngx'
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {ShowOptionsPageModule} from './components/show-options/show-options.module';
import {ShowOptionsPage} from './components/show-options/show-options.page';
import {TopHeaderPageModule} from './components/top-header/top-header.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Camera} from '@ionic-native/camera/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import {CartPage} from './components/cart/cart.page';
import {CartPageModule} from './components/cart/cart.module';
import {WebcamModule} from 'ngx-webcam';
import { PayPal } from '@ionic-native/paypal/ngx';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {IonicGestureConfig} from './services/ionic-gesture-config';
import {LongPressModule} from 'ionic-long-press';
import {AppVersion} from '@ionic-native/app-version/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx'
import { Network } from '@ionic-native/network/ngx'
import { Dialogs } from '@ionic-native/dialogs/ngx'
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

const config:SocketIoConfig = {url: 'http://192.168.2.75:3001', options: {}};

export function jwtOptionsFactory(storage) {
    return {
        tokenGetter: () => {
            return storage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:4000']
    };
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [ShowOptionsPage, CartPage],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        ShowOptionsPageModule,
        ReactiveFormsModule,
        FormsModule,
        CartPageModule,
        WebcamModule,
        LongPressModule,
        SocketIoModule.forRoot(config),
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [NativeStorage],
            }
        })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        StatusBar,
        SplashScreen,
        Facebook,
        NativeStorage,
        PhotoViewer,
        SocialSharing,
        IonicRatingModule,
        FileOpener,
        Camera,
        WebView,
        ImagePicker,
        Deeplinks,
        FileTransfer,
        FilePath,
        FileChooser,
        File,
        Stripe,
        LocalNotifications,
        PayPal,
        AppVersion,
        NetworkInterface,
        Network,
        Dialogs,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: IonicGestureConfig
        },
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
