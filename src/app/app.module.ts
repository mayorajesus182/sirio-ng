import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Needed for Touch functionality of Material Components
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserIdleModule } from 'angular-user-idle';
import { AppTranslateLoader } from 'src/@sirio/i18n/app-translate.loader';
import { AppTranslateMissingHandler } from 'src/@sirio/i18n/app-translate.missinghandler';
import { HttpErrorInterceptor } from 'src/@sirio/interceptors/http.error.interceptor';
import { HttpRequestInterceptor } from 'src/@sirio/interceptors/http.request.interceptor';
import { HttpTokenInterceptor } from 'src/@sirio/interceptors/http.token.interceptor';
import { ApiService } from 'src/@sirio/services/api';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { LayoutModule } from './layout/layout.module';
import { PendingInterceptorModule } from '../@sirio/shared/loading-indicator/pending-interceptor.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    // Angular Core Module // Don't remove!
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SirioSharedModule,
    AppRoutingModule,

    // Layout Module (Sidenav, Toolbar, Quickpanel, Content)
    LayoutModule,

    // Displays Loading Bar when a Route Request or HTTP Request is pending
    PendingInterceptorModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes) 
    // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({ idle: 60*3, timeout: 15, ping: 120 }),
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
    })
    // Register a Service Worker (optional)
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
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
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ]
})
export class AppModule {
}
