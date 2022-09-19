import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpXsrfTokenExtractor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { JwtService } from "../services/jwt.service";
import { Observable } from "rxjs";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private jwtService: JwtService,
        private tokenExtractor: HttpXsrfTokenExtractor) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
                
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept':       'application/json'
        };

        const token = this.jwtService.getToken();
        const token_xsrf = this.tokenExtractor.getToken() as string;


        if (token_xsrf) {
            headersConfig['X-XSRF-TOKEN'] = token_xsrf;
        }

        if (token) {
            headersConfig['Authorization'] = 'Bearer '+token;            
        }
        
        if (token || token_xsrf) {
        
            req = req.clone({ setHeaders: headersConfig});
        }


        return next.handle(req);
    }
}
