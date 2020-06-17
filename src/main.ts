import './polyfills';
import { JitCompiler } from "@angular/compiler";
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import "hammerjs"; // HAMMER TIME

if (environment.production) {
  // enableProdMode();
  // JitCompiler.apply(this)
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
