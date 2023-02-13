import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpXsrfTokenExtractor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from "@angular/common/http";
import { JwtService } from "../services/jwt.service";
import { from, Observable, of } from "rxjs";

import { delay, tap } from "rxjs/operators";
import { RequestCacheService } from "src/@sirio/services/request.cache.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

   

    constructor(private jwtService: JwtService,
        private cache: RequestCacheService,
        private tokenExtractor: HttpXsrfTokenExtractor) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const token = this.jwtService.getToken();
        // console.log("send token ",token);

        const token_xsrf = this.tokenExtractor.getToken() as string;


        if (token_xsrf) {
            headersConfig['X-XSRF-TOKEN'] = token_xsrf;
        }

        if (token) {
            headersConfig['Authorization'] = 'Bearer ' + token;
        }

        if (token || token_xsrf) {

            req = req.clone({ setHeaders: headersConfig });
        }

        // implmentación de cache
        // const cachedResponse = this.cache.get(req);
        // if (cachedResponse) {
        //     // console.log(' obteniendo response del cache ', cachedResponse);
        //     let result: Observable<HttpEvent<any>> = of(cachedResponse as HttpEvent<any>);
        

        //     return result.pipe(delay(1000));
        // }

        // console.log(req);

        // Obtener los datos de la petición
        return next.handle(req).pipe(
            tap(event => {
                if(event instanceof HttpResponse){
                    if ( this.cache.api_chacheable.find(a=>req.urlWithParams.indexOf(a)>=0) != undefined && req.method=='GET' || (req.method=='GET' && req.url.match(this.cache.api_config_regex))) {
                        // console.log(' push response al cache ', req.urlWithParams);
                        this.cache.put(req, event);
                    }
                }
                // if (event instanceof HttpResponse && (this.cache.api_chacheable.find(a=>req.urlWithParams.indexOf(a)>=0) != undefined && req.method=='GET') || (req.method=='GET' && req.url.match(this.cache.api_config_regex))) {
                //     // console.log(' push response al cache ', req.urlWithParams);
                //     this.cache.put(req, event);
                // }
            })
        );
    }
}
