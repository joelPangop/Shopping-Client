import './polyfills';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {defineCustomElements} from '@ionic/pwa-elements/loader';

import 'hammerjs'; // HAMMER TIME

if (environment.production) {
  enableProdMode();
  // JitCompiler.apply(this)
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

defineCustomElements(window);
