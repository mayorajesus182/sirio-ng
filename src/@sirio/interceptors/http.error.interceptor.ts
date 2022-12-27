import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { SnackbarService } from "../services/snackbar.service";
import { JwtService } from "../services/jwt.service";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { SessionService } from "../services/session.service";


// import {Injectable} from '@angular/core';
// import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class HttpErrorInterceptor implements HttpInterceptor {


    constructor(
        private router: Router,
        private snack: SnackbarService,
        private sessionService: SessionService,
        private jwtService: JwtService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {


        return next.handle(req).pipe(catchError(error => {
            // console.log('Response',error);
            if (error instanceof HttpErrorResponse) {
                // console.log('>> Error response',error.error);

                switch (error.status) {
                    case 401:
                        console.warn('Acceso no autorizado', error);
                        if (this.sessionService.isLockScreen()) {
                            //console.log('is lockscreen');
                            this.router.navigate(['user/lockscreen']);
                        } else {
                            this.router.navigate(['user/login']);
                            // this.snack.show({ message: 'Acceso no Autorizado!', type: 'danger' });
                            // horizontalPosition: 'right',
                            this.snack.show({
                                message: 'Acceso no Autorizado!', type: 'danger',
                                verticalPosition: 'top'
                            });

                        }
                        break;
                    case 400:
                        // console.log('Response error!',error);
                        if (!(error instanceof Blob) && error.error && error.error.text) {
                            this.snack.show({ message: error.error.text, type: 'danger' });
                        }else{
                            this.snack.show({ message:'¡Operación rechazada!' , type: 'danger' });
                        }
                        break;
                    case 403:
                        this.router.navigate(['errors/403']);
                        break;
                    case 409:
                        // this.jwtService.destroyToken();
                        this.router.navigate(['errors/session-lost']);
                        break;
                    case 0:
                        // console.warn('Check Your Internet Connection And Try again Later', error);
                        this.snack.show({ message: 'Recurso no disponible, revise su conexión a internet!', type: 'danger' });
                        break;
                }
            }
            return throwError(error);
        }));
    }
}