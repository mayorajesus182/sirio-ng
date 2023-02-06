import { HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { RequestCacheService } from "../request.cache.service";

export interface ApiOption {
  name?: string,
  prefix?: string
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private apiConfig: ApiOption = { name: 'default', prefix: undefined } as ApiOption;

  constructor(
    private cache: RequestCacheService,
    private http: HttpClient
  ) { }


  private getCacheData(url: string): any {
    const cachedData = this.cache.getByUrl(url);
    return cachedData ? cachedData.body : undefined;
  }

  private formatErrors(error: any): Observable<any> {
    console.error('An error occurred: ', error);
    return throwError(error);
  }

  config(opts: ApiOption) {
    this.apiConfig.name = opts.name || 'default';
    this.apiConfig.prefix = opts.prefix || undefined;
    return this;
  }

  page(api: string, filter: string='', page: number, size: number, sortby: string, direction: string) {
    let params = new HttpParams().set('filter', filter)
      .set('sortby', sortby)
      .set('direction', direction)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.get(api, params);
  }

  

  get(path: string, params: HttpParams = new HttpParams(), paramsOpts?: any): Observable<any> {
    if (paramsOpts) {

      Object.keys(paramsOpts).forEach(key => {
        params = params.append(key, paramsOpts[key]);
      });
    }
    // verificar si la peticion ya tiene registros en la cache
    const url = `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`;
    // console.log(`${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`);
    let cacheData = this.getCacheData(url);
    if(cacheData!=undefined){    
    
      return of(cacheData);
    }


    return this.http.get(`${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`, { params })
      .pipe(catchError((e) => this.formatErrors(e)));
  }

  getFromJsonFile(file: string): Observable<any> {
    return this.http.get(`${file}`)
      .pipe(catchError((e) => this.formatErrors(e)));
  }

  /* secureGet(path: string, params: HttpParams = new HttpParams()): Observable<any> {
     return this.http.get(`${environment.apis[this.options.api_name]}/secure${path}`, { params })
       .pipe(catchError((e) => this.formatErrors(e)));
   }*/

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`, body
    ).pipe(catchError((e) => this.formatErrors(e)));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`, body
    ).pipe(catchError((e) => this.formatErrors(e)));
  }


  pushDataFile(path: string, formdata: FormData): Observable<HttpEvent<any>> {
    // const headers = new HttpHeaders({'Keep-Alive': 'timeout=600'});
    const req = new HttpRequest('POST', `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`, formdata, {
      reportProgress: true,
      responseType: 'json',
    });
    
    // headers: headers
    // return this.http.request(req);
    // const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });

    return this.http.request(req);

  }

  pullFileByGet(path: string): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`,  {observe: 'response', responseType: 'blob' as 'json'}
    ).pipe(catchError((e) => this.formatErrors(e)));
  }

  pullFileByGetByFilters(path: string,params:HttpParams): Observable<HttpResponse<Blob>> {
    return this.http.get(
      `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`,  {observe: 'response', responseType: 'blob' as 'json',params:params}
    ).pipe(catchError((e) => this.formatErrors(e)));
  }

  pullFileByPost(path: string, body: Object = {}): Observable<HttpResponse<Blob>> {
    return this.http.post(
      `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`, body, {observe: 'response', responseType: 'blob' as 'json'}
    ).pipe(catchError((e) => this.formatErrors(e)));
  }


  loadParamsOpts(params: HttpParams, opts: any = {}) {

    for (const key of Object.keys(opts)) {
      const value = opts[key];
      params = params.append(key, value);
    }

    return params;
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api[this.apiConfig.name]}${this.apiConfig.prefix || ''}${path}`
    ).pipe(catchError((e) => this.formatErrors(e)));
  }
}
