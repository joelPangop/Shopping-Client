// @ts-ignore
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

import {RouteReuseStrategy} from '@angular/router';

import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Facebook} from '@ionic-native/facebook/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {IonicRatingModule} from 'ionic4-rating';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {File} from '@ionic-native/file/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {ShowOptionsPageModule} from './components/show-options/show-options.module';
import {ShowOptionsPage} from './components/show-options/show-options.page';
import {Camera} from '@ionic-native/camera/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {Stripe} from '@ionic-native/stripe/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {CartPage} from './components/cart/cart.page';
import {CartPageModule} from './components/cart/cart.module';
import {WebcamModule} from 'ngx-webcam';
import {PayPal} from '@ionic-native/paypal/ngx';
import {IonicGestureConfig} from './services/ionic-gesture-config';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {NetworkInterface} from '@ionic-native/network-interface/ngx';
import {Network} from '@ionic-native/network/ngx';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {ShowNotificationPage} from './components/show-notification/show-notification.page';
import {ShowNotificationPageModule} from './components/show-notification/show-notification.module';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ViewProfilePage} from './components/view-profile/view-profile.page';
import {ViewProfilePageModule} from './components/view-profile/view-profile.module';
import {StoreListPage} from './components/store-list/store-list.page';
import {StoreListPageModule} from './components/store-list/store-list.module';
import {ProductDetailPage} from './components/product-detail/product-detail.page';
import {ProductDetailPageModule} from './components/product-detail/product-detail.module';
import {SearchPage} from './components/search/search.page';
import {SearchPageModule} from './components/search/search.module';
import {FilterPage} from './components/filter/filter.page';
import {FilterPageModule} from './components/filter/filter.module';
import {HomeTopSliderPage} from './components/home-top-slider/home-top-slider.page';
import {HomeTopSliderPageModule} from './components/home-top-slider/home-top-slider.module';
import {FeaturedProductsPage} from './components/featured-products/featured-products.page';
import {FeaturedProductsPageModule} from './components/featured-products/featured-products.module';
import {CategoriesPageModule} from './components/categories/categories.module';
import {CategoriesPage} from './components/categories/categories.page';
import {HotDealsPageModule} from './components/hot-deals/hot-deals.module';
import {HotDealsPage} from './components/hot-deals/hot-deals.page';
import {ShowCatOptionPage} from './components/show-cat-option/show-cat-option.page';
import {ShowCatOptionPageModule} from './components/show-cat-option/show-cat-option.module';
import {ProductViewPage} from './components/product-view/product-view.page';
import {ProductViewPageModule} from './components/product-view/product-view.module';
import {CheckoutPage} from './components/checkout/checkout.page';
import {CheckoutPageModule} from './components/checkout/checkout.module';
import {OrderViewPage} from './components/order-view/order-view.page';
import {OrderViewPageModule} from './components/order-view/order-view.module';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {LandingPagePage} from './components/auth/landing-page/landing-page.page';
import {LandingPagePageModule} from './components/auth/landing-page/landing-page.module';
import {SearchCategoriesPage} from './components/search-categories/search-categories.page';
import {SearchCategoriesPageModule} from './components/search-categories/search-categories.module';
import {PreviewSearchPage} from './components/preview-search/preview-search.page';
import {PreviewSearchPageModule} from './components/preview-search/preview-search.module';
import {IonicSelectableModule} from 'ionic-selectable';
import {CreateProductPageModule} from './components/create-product/create-product.module';
import {CreateProductPage} from './components/create-product/create-product.page';
import {PreviewVideoPage} from './components/preview-video/preview-video.page';
import {PreviewVideoPageModule} from './components/preview-video/preview-video.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Globalization} from '@ionic-native/globalization/ngx';
import localeFr from '@angular/common/locales/fr';
import {StreamingMedia} from '@ionic-native/streaming-media/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {BankPageModule} from './components/bank/bank.module';
import {BankViewPage} from './components/bank-view/bank-view.page';
import {BankViewPageModule} from './components/bank-view/bank-view.module';
import {CommandeViewPage} from './components/commande-view/commande-view.page';
import {CommandeViewPageModule} from './components/commande-view/commande-view.module';

export function jwtOptionsFactory(storage) {
    return {
        tokenGetter: () => {
            return storage.get('access_token');
        },
        whitelistedDomains: ['https://egoalservice.azurewebsites.net']
    };
}

let CREDENTIALS = {
    apiKey: 'AIzaSyAPhAsMPLUjU8eCDWOE17_yoIyaCu7D3kU',
    authDomain: 'egoal-shopping.firebaseapp.com',
    databaseURL: 'https://egoal-shopping.firebaseio.com',
    projectId: 'egoal-shopping',
    storageBucket: 'egoal-shopping.appspot.com',
    messagingSenderId: '135938716350',
    appId: '1:135938716350:web:8d5e38fada46137f26a4ef',
    measurementId: 'G-1QECVFYK2L'

};
// const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };
// @ts-ignore
@NgModule({
    declarations: [AppComponent],
    entryComponents: [ShowOptionsPage, CartPage, ShowNotificationPage, ViewProfilePage, StoreListPage, ProductDetailPage, SearchPage,
        FilterPage, HomeTopSliderPage, FeaturedProductsPage, CategoriesPage, HotDealsPage, ShowCatOptionPage, ProductViewPage, CheckoutPage,
        OrderViewPage, LandingPagePage, SearchCategoriesPage, PreviewSearchPage, CreateProductPage, PreviewVideoPage, BankViewPage,
        CommandeViewPage],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        ShowOptionsPageModule,
        ShowNotificationPageModule,
        ViewProfilePageModule,
        StoreListPageModule,
        ProductDetailPageModule,
        SearchPageModule,
        FilterPageModule,
        HomeTopSliderPageModule,
        FeaturedProductsPageModule,
        CategoriesPageModule,
        HotDealsPageModule,
        ShowCatOptionPageModule,
        ProductViewPageModule,
        CheckoutPageModule,
        OrderViewPageModule,
        LandingPagePageModule,
        SearchCategoriesPageModule,
        PreviewSearchPageModule,
        CreateProductPageModule,
        PreviewVideoPageModule,
        BankViewPageModule,
        CommandeViewPageModule,
        // BsDatepickerModule.forRoot(),
        // SocketIoModule.forRoot(config),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        // BrowserAnimationsModule,
        IonicStorageModule.forRoot(),
        CartPageModule,
        WebcamModule,
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [Storage],
            }
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        StatusBar,
        SplashScreen,
        Facebook,
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
        Globalization,
        IonicSelectableModule,
        StreamingMedia,
        EmailComposer,
        SMS,
        PayPal,
        {provide: LOCALE_ID, useValue: 'fr'},
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

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeFr, 'fr');
