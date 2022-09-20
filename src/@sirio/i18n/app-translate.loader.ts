import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiConfConstants } from "../constants";
import { ApiOption, ApiService } from "../services/api";

export class AppTranslateLoader implements TranslateLoader {
  private apiConfig: ApiOption;
  constructor(private apiService: ApiService) {
    this.apiConfig = { name: ApiConfConstants.API_DEFAULT, prefix: '/public/assets/i18n' };
  }

  getTranslation(lang: string): Observable<any> {
    console.log(' set current  lang: ' + lang);
    const key = `${lang}.json`;
    const data_json = localStorage.getItem(key);
    if(data_json){
      console.log('El idioma esta en json storage '+key);
      
      // return JSON.parse(data_json);
    }

    let data = this.apiService.config(this.apiConfig).get(`/${lang}.json`).pipe(catchError((_) => this.apiService.config(this.apiConfig).get(`/es.json`)));
  
    data.subscribe(dt =>localStorage.setItem(key,dt));
    return data;
  }
} 