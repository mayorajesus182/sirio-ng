import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Touch functionality of Material Components
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { AppTranslateLoader } from 'src/@sirio/i18n/app-translate.loader';
import { AppTranslateMissingHandler } from 'src/@sirio/i18n/app-translate.missinghandler';
import { HttpErrorInterceptor } from 'src/@sirio/interceptors/http.error.interceptor';
import { HttpRequestInterceptor } from 'src/@sirio/interceptors/http.request.interceptor';
import { HttpTokenInterceptor } from 'src/@sirio/interceptors/http.token.interceptor';
import { ApiService } from 'src/@sirio/services/api';
import { PendingInterceptorModule } from 'src/@sirio/shared/loading-indicator/pending-interceptor.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import {environment} from "../environments/environment";
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // SirioSharedModule,
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,
    
    TranslateModule.forRoot({
      missingTranslationHandler: 
      {
        provide: MissingTranslationHandler, 
        useClass: AppTranslateMissingHandler
      },
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
        deps: [ApiService],
      }
    }),
    // Register a Service Worker
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:20000'
    })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline'
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      } as MatSnackBarConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },    
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private swUpdate: SwUpdate) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(v => {
        console.warn('version update ',v);
        
        // if (confirm('New version available. Load new version?')) {
        //   window.location.reload();
        // }
      });
    }
  }
}
